const db = require('../config/database');

/**
 * Product Controller
 * Xử lý các API liên quan đến sản phẩm
 */

module.exports = {
  /**
   * GET /api/products/:slug
   * Lấy chi tiết sản phẩm theo slug
   */
  getProductBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      // Lấy thông tin sản phẩm
      const [products] = await db.query(`
        SELECT 
          p.*,
          c.name as category_name,
          c.slug as category_slug,
          b.name as brand_name,
          b.slug as brand_slug,
          b.logo as brand_logo,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.slug = ? AND p.is_active = TRUE
      `, [slug]);

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại'
        });
      }

      const product = products[0];

      // Tăng view count (chỉ nếu cột tồn tại)
      try {
        await db.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [product.id]);
      } catch (e) {
        // Cột view_count không tồn tại, bỏ qua
      }

      // Lấy danh sách hình ảnh
      const [images] = await db.query(`
        SELECT id, url, alt_text, sort_order, is_primary
        FROM product_images
        WHERE product_id = ?
        ORDER BY sort_order ASC, is_primary DESC
      `, [product.id]);

      // Lấy các biến thể (variants)
      const [variants] = await db.query(`
        SELECT 
          pv.*,
          s.name as size_name,
          s.code as size_code,
          c.name as color_name,
          c.code as color_code,
          c.hex_code
        FROM product_variants pv
        LEFT JOIN sizes s ON pv.size_id = s.id
        LEFT JOIN colors c ON pv.color_id = c.id
        WHERE pv.product_id = ? AND pv.is_active = TRUE
        ORDER BY s.sort_order ASC, c.sort_order ASC
      `, [product.id]);

      // Nhóm variants theo size và color
      const sizes = Array.from(new Map(variants
        .filter(v => v.size_id)
        .map(v => [v.size_id, { id: v.size_id, name: v.size_name, code: v.size_code }]))
        .values());

      const colors = Array.from(new Map(variants
        .filter(v => v.color_id)
        .map(v => [v.color_id, { id: v.color_id, name: v.color_name, code: v.color_code, hex: v.hex_code }]))
        .values());

      // Tính discount percent
      const discountPercent = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - product.price / product.compare_price) * 100)
        : 0;

      // Lấy đánh giá sản phẩm
      const [reviews] = await db.query(`
        SELECT 
          pr.*,
          u.name as user_name,
          u.avatar as user_avatar
        FROM product_reviews pr
        INNER JOIN users u ON pr.user_id = u.id
        WHERE pr.product_id = ? AND pr.is_approved = TRUE AND pr.is_active = TRUE
        ORDER BY pr.created_at DESC
        LIMIT 10
      `, [product.id]);

      // Lấy sản phẩm liên quan
      const [relatedProducts] = await db.query(`
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.price,
          p.compare_price,
          p.stock,
          c.name as category_name,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
        ORDER BY p.is_featured DESC, p.created_at DESC
        LIMIT 4
      `, [product.category_id, product.id]);

      res.json({
        success: true,
        data: {
          ...product,
          avg_rating: parseFloat(product.avg_rating) || 0,
          review_count: parseInt(product.review_count) || 0,
          images,
          variants,
          sizes,
          colors,
          discount_percent: discountPercent,
          reviews: reviews.map(r => ({
            ...r,
            user_avatar: r.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user_name)}&background=4450b7&color=fff`
          })),
          related_products: relatedProducts.map(p => ({
            ...p,
            avg_rating: parseFloat(p.avg_rating) || 0,
            review_count: parseInt(p.review_count) || 0,
            image_url: p.image_url || 'https://via.placeholder.com/400x533',
            is_on_sale: p.compare_price && p.compare_price > p.price
          }))
        }
      });

    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải thông tin sản phẩm'
      });
    }
  },

  /**
   * GET /api/products
   * Lấy danh sách sản phẩm với filter
   */
  getProducts: async (req, res) => {
    try {
      const {
        search,
        category,
        brand,
        gender,
        age_group,
        min_price,
        max_price,
        size,
        color,
        discount,
        sort = 'created_at',
        order = 'desc',
        page = 1,
        limit = 12
      } = req.query;

      let whereClause = 'WHERE p.is_active = TRUE';
      const params = [];

      const splitParam = (value) => String(value || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)

      if (search && search.trim()) {
        const keyword = `%${search.trim()}%`;
        whereClause += ` AND (
          p.name LIKE ? OR p.sku LIKE ? OR p.short_description LIKE ? OR
          p.description LIKE ? OR c.name LIKE ? OR b.name LIKE ?
        )`;
        params.push(keyword, keyword, keyword, keyword, keyword, keyword);
      }

      if (category) {
        whereClause += ' AND c.slug = ?';
        params.push(category);
      }

      if (brand) {
        whereClause += ' AND b.slug = ?';
        params.push(brand);
      }

      if (gender) {
        whereClause += ' AND p.gender = ?';
        params.push(gender);
      }

      if (age_group) {
        if (age_group === 'kids') {
          whereClause += ' AND p.gender IN (?, ?)';
          params.push('kids_boy', 'kids_girl');
        } else {
          whereClause += ' AND p.gender = ?';
          params.push(age_group);
        }
      }

      if (min_price) {
        whereClause += ' AND p.price >= ?';
        params.push(min_price);
      }

      if (max_price) {
        whereClause += ' AND p.price <= ?';
        params.push(max_price);
      }

      const sizes = splitParam(size);
      if (sizes.length > 0) {
        whereClause += ` AND EXISTS (
          SELECT 1 FROM product_variants pv_size
          LEFT JOIN sizes s_filter ON pv_size.size_id = s_filter.id
          WHERE pv_size.product_id = p.id
            AND pv_size.is_active = TRUE
            AND (s_filter.code IN (?) OR s_filter.name IN (?))
        )`;
        params.push(sizes, sizes);
      }

      const colors = splitParam(color);
      if (colors.length > 0) {
        whereClause += ` AND EXISTS (
          SELECT 1 FROM product_variants pv_color
          LEFT JOIN colors c_filter ON pv_color.color_id = c_filter.id
          WHERE pv_color.product_id = p.id
            AND pv_color.is_active = TRUE
            AND (
              CAST(c_filter.id AS CHAR) IN (?) OR
              c_filter.code IN (?) OR
              c_filter.name IN (?) OR
              LOWER(REPLACE(c_filter.name, ' ', '-')) IN (?)
            )
        )`;
        params.push(colors, colors, colors, colors);
      }

      const discounts = splitParam(discount).map(Number).filter(Number.isFinite);
      if (discounts.length > 0) {
        const minDiscount = Math.min(...discounts);
        whereClause += ' AND p.compare_price IS NOT NULL AND p.compare_price > p.price AND ((1 - p.price / p.compare_price) * 100) >= ?';
        params.push(minDiscount);
      }

      // Validate sort column
      const allowedSorts = ['created_at', 'price', 'name', 'total_sold', 'view_count'];
      const sortColumn = allowedSorts.includes(sort) ? sort : 'created_at';
      const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Lấy tổng số
      const [countResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        ${whereClause}
      `, params);

      const [products] = await db.query(`
        SELECT
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.compare_price,
          p.stock,
          p.gender,
          p.is_featured,
          c.name as category_name,
          c.slug as category_slug,
          b.name as brand_name,
          b.slug as brand_slug,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        ${whereClause}
        ORDER BY p.${sortColumn} ${sortOrder}
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), offset]);

      res.json({
        success: true,
        data: {
          products: products.map(p => ({
            ...p,
            avg_rating: parseFloat(p.avg_rating) || 0,
            review_count: parseInt(p.review_count) || 0,
            image_url: p.image_url || 'https://via.placeholder.com/400x533',
            is_on_sale: p.compare_price && p.compare_price > p.price
          })),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(countResult[0].total) || 0,
            total_pages: Math.ceil(parseInt(countResult[0].total) / parseInt(limit))
          }
        }
      });

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải danh sách sản phẩm'
      });
    }
  },

  /**
   * GET /api/products/kids-categories
   * Lấy số lượng sản phẩm theo category cho trẻ em
   */
  getKidsCategories: async (req, res) => {
    try {
      const [categories] = await db.query(`
        SELECT
          c.slug,
          c.name,
          COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id AND p.gender IN ('kids_boy', 'kids_girl') AND p.is_active = TRUE
        WHERE c.slug IN ('ao-tre-em', 'quan-tre-em', 'vay-tre-em', 'dam-tre-em', 'bo-do-tre-em')
        GROUP BY c.slug, c.name
      `);

      const [totalResult] = await db.query(`
        SELECT COUNT(*) as total FROM products WHERE gender IN ('kids_boy', 'kids_girl') AND is_active = TRUE
      `);

      const categoriesWithAll = [
        { id: 'all', name: 'Tất cả', count: parseInt(totalResult[0].total) || 0 },
        ...categories.map(c => ({
          id: c.slug,
          name: c.name,
          count: parseInt(c.product_count) || 0
        }))
      ];

      res.json({
        success: true,
        data: categoriesWithAll
      });

    } catch (error) {
      console.error('Error fetching kids categories:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải danh mục trẻ em'
      });
    }
  },

  /**
   * GET /api/products/kids
   * Lấy danh sách sản phẩm trẻ em với filter
   */
  getKidsProducts: async (req, res) => {
    try {
      const {
        category,
        min_price,
        max_price,
        size,
        color,
        discount,
        sort = 'created_at',
        order = 'desc',
        page = 1,
        limit = 12
      } = req.query;

      let whereClause = 'WHERE p.is_active = TRUE AND p.gender IN (?, ?)';
      const params = ['kids_boy', 'kids_girl'];
      const splitParam = (value) => String(value || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)

      if (category && category !== 'all') {
        whereClause += ' AND c.slug = ?';
        params.push(category);
      }

      if (min_price) {
        whereClause += ' AND p.price >= ?';
        params.push(min_price);
      }

      if (max_price) {
        whereClause += ' AND p.price <= ?';
        params.push(max_price);
      }

      const sizes = splitParam(size);
      if (sizes.length > 0) {
        whereClause += ` AND EXISTS (
          SELECT 1 FROM product_variants pv_size
          LEFT JOIN sizes s_filter ON pv_size.size_id = s_filter.id
          WHERE pv_size.product_id = p.id
            AND pv_size.is_active = TRUE
            AND (s_filter.code IN (?) OR s_filter.name IN (?))
        )`;
        params.push(sizes, sizes);
      }

      const colors = splitParam(color);
      if (colors.length > 0) {
        whereClause += ` AND EXISTS (
          SELECT 1 FROM product_variants pv_color
          LEFT JOIN colors c_filter ON pv_color.color_id = c_filter.id
          WHERE pv_color.product_id = p.id
            AND pv_color.is_active = TRUE
            AND (
              CAST(c_filter.id AS CHAR) IN (?) OR
              c_filter.code IN (?) OR
              c_filter.name IN (?) OR
              LOWER(REPLACE(c_filter.name, ' ', '-')) IN (?)
            )
        )`;
        params.push(colors, colors, colors, colors);
      }

      const discounts = splitParam(discount).map(Number).filter(Number.isFinite);
      if (discounts.length > 0) {
        const minDiscount = Math.min(...discounts);
        whereClause += ' AND p.compare_price IS NOT NULL AND p.compare_price > p.price AND ((1 - p.price / p.compare_price) * 100) >= ?';
        params.push(minDiscount);
      }

      const allowedSorts = ['created_at', 'price', 'name', 'total_sold', 'view_count'];
      const sortColumn = allowedSorts.includes(sort) ? sort : 'created_at';
      const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const [countResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
      `, params);

      const [products] = await db.query(`
        SELECT
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.compare_price,
          p.stock,
          p.gender,
          p.is_featured,
          c.name as category_name,
          c.slug as category_slug,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ${whereClause}
        ORDER BY p.${sortColumn} ${sortOrder}
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), offset]);

      res.json({
        success: true,
        data: {
          products: products.map(p => ({
            ...p,
            avg_rating: parseFloat(p.avg_rating) || 0,
            review_count: parseInt(p.review_count) || 0,
            image_url: p.image_url || 'https://via.placeholder.com/400x533',
            is_on_sale: p.compare_price && p.compare_price > p.price
          })),
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(countResult[0].total) || 0,
            total_pages: Math.ceil(parseInt(countResult[0].total) / parseInt(limit))
          }
        }
      });

    } catch (error) {
      console.error('Error fetching kids products:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải sản phẩm trẻ em'
      });
    }
  },

  /**
   * GET /api/products/search
   * Tìm kiếm sản phẩm
   */
  searchProducts: async (req, res) => {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
        });
      }

      const searchTerm = `%${q.trim()}%`;

      const [products] = await db.query(`
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.compare_price,
          p.stock,
          p.gender,
          c.name as category_name,
          c.slug as category_slug,
          b.name as brand_name,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.is_active = TRUE
          AND (p.name LIKE ? OR p.short_description LIKE ? OR p.description LIKE ? OR b.name LIKE ?)
        ORDER BY p.is_featured DESC, p.view_count DESC
        LIMIT 20
      `, [searchTerm, searchTerm, searchTerm, searchTerm]);

      res.json({
        success: true,
        data: {
          products: products.map(p => ({
            ...p,
            avg_rating: parseFloat(p.avg_rating) || 0,
            review_count: parseInt(p.review_count) || 0,
            image_url: p.image_url || 'https://via.placeholder.com/400x533',
            is_on_sale: p.compare_price && p.compare_price > p.price
          })),
          total: products.length
        }
      });

    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tìm kiếm sản phẩm'
      });
    }
  },

  /**
   * GET /api/products/suggested
   * Lấy sản phẩm gợi ý cho cart drawer
   */
  getSuggestedProducts: async (req, res) => {
    try {
      const { exclude, limit = 6 } = req.query;
      let excludeClause = '';
      const params = [];

      if (exclude) {
        const excludeIds = exclude.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
        if (excludeIds.length > 0) {
          excludeClause = 'WHERE p.id NOT IN (?) AND p.is_active = TRUE';
          params.push(excludeIds);
        } else {
          excludeClause = 'WHERE p.is_active = TRUE';
        }
      } else {
        excludeClause = 'WHERE p.is_active = TRUE';
      }

      const [products] = await db.query(`
        SELECT
          p.id,
          p.name,
          p.slug,
          p.price,
          p.compare_price,
          p.is_online_exclusive,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT COUNT(*) FROM product_variants WHERE product_id = p.id AND is_active = TRUE) as variant_count,
          (SELECT HEX(hex_code) FROM colors c
           JOIN product_variants pv ON pv.color_id = c.id
           WHERE pv.product_id = p.id AND c.hex_code IS NOT NULL
           LIMIT 1) as color_hex
        FROM products p
        ${excludeClause}
        ORDER BY p.is_featured DESC, p.view_count DESC, p.total_sold DESC
        LIMIT ?
      `, [...params, parseInt(limit)]);

      const productsWithColors = await Promise.all(products.map(async (product) => {
        const [variants] = await db.query(`
          SELECT c.name, c.hex_code
          FROM product_variants pv
          JOIN colors c ON pv.color_id = c.id
          WHERE pv.product_id = ? AND c.hex_code IS NOT NULL
          GROUP BY c.id
          LIMIT 4
        `, [product.id]);

        return {
          ...product,
          image_url: product.image_url || 'https://via.placeholder.com/400x533',
          is_on_sale: product.compare_price && product.compare_price > product.price,
          colors: variants.map(v => ({
            name: v.name,
            hex: v.hex_code
          }))
        };
      }));

      res.json({
        success: true,
        data: productsWithColors
      });

    } catch (error) {
      console.error('Error fetching suggested products:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải gợi ý sản phẩm'
      });
    }
  }
};
