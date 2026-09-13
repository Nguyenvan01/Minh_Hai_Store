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

      // Tăng view count
      await db.query('UPDATE products SET view_count = view_count + 1 WHERE id = ?', [product.id]);

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
        message: 'Không thể tải thông tin sản phẩm',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        category,
        brand,
        gender,
        age_group,
        min_price,
        max_price,
        sort = 'created_at',
        order = 'desc',
        page = 1,
        limit = 12
      } = req.query;

      console.log('[getProducts] Query params:', req.query);
      console.log('[getProducts] age_group:', age_group);

      let whereClause = 'WHERE p.is_active = TRUE';
      const params = [];

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
        whereClause += ' AND p.age_group = ?';
        params.push(age_group);
      }

      if (min_price) {
        whereClause += ' AND p.price >= ?';
        params.push(min_price);
      }

      if (max_price) {
        whereClause += ' AND p.price <= ?';
        params.push(max_price);
      }

      // Validate sort column
      const allowedSorts = ['created_at', 'price', 'name', 'total_sold', 'view_count'];
      const sortColumn = allowedSorts.includes(sort) ? sort : 'created_at';
      const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Lấy tổng số
      console.log('[getProducts] SQL params:', params);
      const [countResult] = await db.query(`
        SELECT COUNT(*) as total
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        ${whereClause}
      `, params);

      // Lấy danh sách sản phẩm
      console.log('[getProducts] Before SELECT, params:', params, 'whereClause:', whereClause);
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
          p.age_group,
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
      
      console.log('[getProducts] Products count:', products.length);
      if (products.length > 0) {
        console.log('[getProducts] First product age_group:', products[0].age_group);
      }

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
        message: 'Không thể tải danh sách sản phẩm',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        LEFT JOIN products p ON p.category_id = c.id AND p.age_group = 'kids' AND p.is_active = TRUE
        WHERE c.slug IN ('ao-tre-em', 'quan-tre-em', 'vay-tre-em', 'dam-tre-em', 'bo-do-tre-em')
        GROUP BY c.slug, c.name
      `);

      // Đếm tổng số sản phẩm trẻ em
      const [totalResult] = await db.query(`
        SELECT COUNT(*) as total FROM products WHERE age_group = 'kids' AND is_active = TRUE
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
        message: 'Không thể tải danh mục trẻ em',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
          AND (p.name ILIKE ? OR p.short_description ILIKE ? OR p.description ILIKE ? OR b.name ILIKE ?)
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
        message: 'Không thể tìm kiếm sản phẩm',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};
