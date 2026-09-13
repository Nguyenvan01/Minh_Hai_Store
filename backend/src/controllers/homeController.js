const db = require('../config/database');

/**
 * Homepage Controller
 * Sử dụng chính xác database schema có sẵn
 */

module.exports = {
  /**
   * GET /api/home
   * Lấy toàn bộ dữ liệu trang chủ
   * 
   * Database mapping:
   * - banners → promotions (promotion_type = 'flash_sale', banner = image)
   * - categories → categories (is_featured = TRUE)
   * - featuredProducts → products (is_featured = TRUE)
   * - bestSellers → products (ORDER BY total_sold DESC)
   * - flashSales → products trong promotions
   * - brands → brands (is_featured = TRUE)
   * - reviews → product_reviews
   * - news → news
   */
  getHomeData: async (req, res) => {
    try {
      // 1. BANNERS - Từ promotions với banner image
      const [banners] = await db.query(`
        SELECT 
          p.id,
          p.name,
          p.description,
          p.banner as image,
          p.banner_url as link_url,
          p.slug,
          p.discount_type,
          p.discount_value,
          p.valid_from,
          p.valid_until,
          p.promotion_type
        FROM promotions p
        WHERE p.is_active = TRUE
          AND p.banner IS NOT NULL
          AND p.banner != ''
          AND (p.valid_until IS NULL OR p.valid_until > NOW())
        ORDER BY p.priority DESC, p.created_at DESC
        LIMIT 5
      `);

      // 2. CATEGORIES - Featured categories
      const [categories] = await db.query(`
        SELECT 
          id,
          name,
          slug,
          image,
          description,
          icon
        FROM categories
        WHERE is_active = TRUE 
          AND is_featured = TRUE
        ORDER BY sort_order ASC
        LIMIT 4
      `);

      // 3. FEATURED PRODUCTS - Sản phẩm nổi bật
      const [featuredProducts] = await db.query(`
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.compare_price,
          p.stock,
          p.total_sold,
          p.gender,
          p.is_featured,
          p.material,
          p.season,
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
        WHERE p.is_active = TRUE 
          AND p.is_featured = TRUE
        ORDER BY p.created_at DESC
        LIMIT 8
      `);

      // 4. BEST SELLERS - Sản phẩm bán chạy
      const [bestSellers] = await db.query(`
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.compare_price,
          p.stock,
          p.total_sold,
          p.gender,
          c.name as category_name,
          b.name as brand_name,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.is_active = TRUE 
          AND p.total_sold > 0
        ORDER BY p.total_sold DESC
        LIMIT 8
      `);

      // 5. FLASH SALE PRODUCTS - Sản phẩm trong khuyến mãi flash_sale
      const [flashSales] = await db.query(`
        SELECT DISTINCT
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.compare_price,
          p.stock,
          p.total_sold,
          p.gender,
          c.name as category_name,
          b.name as brand_name,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count,
          pr.discount_value as sale_percent,
          pr.valid_until as sale_end_time
        FROM products p
        INNER JOIN promotions pr ON (
          COALESCE(pr.applicable_products, '[]')::jsonb @> to_jsonb(p.id)
          OR COALESCE(pr.applicable_categories, '[]')::jsonb @> to_jsonb(p.category_id)
        )
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.is_active = TRUE
          AND pr.is_active = TRUE
          AND pr.promotion_type = 'flash_sale'
          AND pr.valid_from <= NOW()
          AND (pr.valid_until IS NULL OR pr.valid_until > NOW())
        ORDER BY p.total_sold DESC
        LIMIT 10
      `);

      // 5b. SALE PRODUCTS - Sản phẩm có compare_price > price (giảm giá thường)
      const [saleProducts] = await db.query(`
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.short_description,
          p.price,
          p.compare_price,
          p.stock,
          p.total_sold,
          p.gender,
          c.name as category_name,
          b.name as brand_name,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.is_active = TRUE
          AND p.compare_price IS NOT NULL
          AND p.compare_price > p.price
        ORDER BY (p.compare_price - p.price) DESC
        LIMIT 8
      `);

      // 6. BRANDS - Thương hiệu nổi bật
      const [brands] = await db.query(`
        SELECT 
          id,
          name,
          slug,
          logo,
          description,
          country,
          website
        FROM brands
        WHERE is_active = TRUE 
          AND is_featured = TRUE
        ORDER BY name ASC
        LIMIT 8
      `);

      // 7. REVIEWS - Đánh giá sản phẩm
      const [reviews] = await db.query(`
        SELECT 
          pr.id,
          pr.product_id,
          pr.rating,
          pr.title,
          pr.content,
          pr.created_at,
          pr.is_verified_purchase,
          p.name as product_name,
          p.slug as product_slug,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as product_image,
          u.name as user_name,
          u.avatar as user_avatar
        FROM product_reviews pr
        INNER JOIN products p ON pr.product_id = p.id
        INNER JOIN users u ON pr.user_id = u.id
        WHERE pr.is_approved = TRUE
        ORDER BY pr.created_at DESC
        LIMIT 6
      `);

      // 8. NEWS/BLOG - Tin tức
      const [news] = await db.query(`
        SELECT 
          id,
          title,
          slug,
          summary,
          thumbnail,
          category,
          tags,
          view_count,
          author_name,
          published_at
        FROM news
        WHERE is_published = TRUE
          AND published_at IS NOT NULL
          AND published_at <= NOW()
        ORDER BY published_at DESC
        LIMIT 3
      `);

      // Tính countdown cho flash sale
      let flashSaleTimer = null;
      if (flashSales.length > 0) {
        const endTime = new Date(flashSales[0].sale_end_time);
        const now = new Date();
        const diff = endTime - now;
        
        if (diff > 0) {
          flashSaleTimer = {
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          };
        }
      }

      // Response
      res.json({
        success: true,
        data: {
          banners: banners.map(b => ({
            ...b,
            image: b.image || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1920'
          })),
          categories: categories.length > 0 ? categories : getDefaultCategories(),
          featuredProducts: featuredProducts.map(enrichProduct),
          bestSellers: bestSellers.map(enrichProduct),
          flashSales: {
            products: flashSales.map(enrichProduct),
            timer: flashSaleTimer || { hours: 0, minutes: 0, seconds: 0 }
          },
          saleProducts: saleProducts.map(enrichProduct),
          brands: brands.length > 0 ? brands : getDefaultBrands(),
          reviews: reviews,
          news: news.length > 0 ? news : getDefaultNews()
        }
      });

    } catch (error) {
      console.error('Error fetching home data:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải dữ liệu trang chủ',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

// Helper: Enrich product với computed fields
function enrichProduct(product) {
  //Ưu tiên sale_percent từ promotion flash_sale, không tính lại từ compare_price
  const discountPercent = product.sale_percent
    ? parseInt(product.sale_percent)
    : (product.compare_price && product.compare_price > product.price
      ? Math.round((1 - product.price / product.compare_price) * 100)
      : 0);

  return {
    ...product,
    avg_rating: parseFloat(product.avg_rating) || 0,
    review_count: parseInt(product.review_count) || 0,
    discount_percent: discountPercent,
    image_url: product.image_url || 'https://via.placeholder.com/400x533',
    is_on_sale: discountPercent > 0,
    is_out_of_stock: product.stock === 0
  };
}

// Default data khi database trống
function getDefaultCategories() {
  return [
    { id: 1, name: 'Áo thun', slug: 'ao-thun', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' },
    { id: 2, name: 'Phụ kiện', slug: 'phu-kien', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
    { id: 3, name: 'Jean', slug: 'jean', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600' },
    { id: 4, name: 'Giày', slug: 'giay', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' }
  ];
}

function getDefaultBrands() {
  return [
    { id: 1, name: 'NIKE', slug: 'nike' },
    { id: 2, name: 'ADIDAS', slug: 'adidas' },
    { id: 3, name: 'ZARA', slug: 'zara' },
    { id: 4, name: 'H&M', slug: 'hm' },
    { id: 5, name: 'UNIQLO', slug: 'uniqlo' }
  ];
}

function getDefaultNews() {
  return [
    {
      id: 1,
      title: 'Tương lai của những đường may cắt bằng Laser',
      slug: 'tuong-lai-duong-may-cat-laser',
      summary: 'Khám phá cách tự động hóa robot đang định nghĩa lại độ chính xác của cấu trúc thời trang kiến trúc.',
      thumbnail: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600',
      category: 'Bền vững'
    },
    {
      id: 2,
      title: 'Giao điểm: Công năng & Hình thái',
      slug: 'giao-diem-cong-nang-hinh-thai',
      summary: 'Nhà thiết kế chính của chúng tôi thảo luận về sự cân bằng giữa túi ưu tiên tiện dụng và kiểu dáng sàn diễn cao cấp.',
      thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600',
      category: 'Phòng thí nghiệm thiết kế'
    },
    {
      id: 3,
      title: 'Tính linh động đô thị năm 2024',
      slug: 'tinh-linh-dong-do-thi-2024',
      summary: 'Tại sao trang phục kỹ thuật đang trở thành đồng phục hàng ngày cho những người du mục kỹ thuật số hiện đại.',
      thumbnail: 'https://images.unsplash.com/photo-1514580428313-1a8b7c43b55e?w=600',
      category: 'Văn hóa'
    }
  ];
}
