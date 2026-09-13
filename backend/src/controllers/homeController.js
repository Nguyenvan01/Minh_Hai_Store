/**
 * Homepage Controller
 * Sử dụng database schema v2 - thiết kế phù hợp giao diện frontend
 *
 * Frontend sections → Database tables:
 * - banners (slider) → banners
 * - vouchers (khuyến mãi) → vouchers
 * - featuredProducts (sản phẩm mới) → products (is_featured = TRUE)
 * - collections (bộ sưu tập) → collections
 * - categoryRow (dòng hàng nổi bật) → categories (is_featured = TRUE)
 * - homewearProducts → products (category: homewear)
 * - tshirtProducts → products (category: tshirt)
 * - vayProducts → products (category: vay)
 * - news (blog) → news
 * - flashSale → vouchers (discount_type = 'percentage', valid_until > NOW())
 */

const db = require('../config/database');

module.exports = {
  getHomeData: async (req, res) => {
    try {
      // 1. BANNERS - Slider trang chủ
      const [banners] = await db.query(`
        SELECT
          id,
          title,
          slug,
          image,
          link_url,
          description,
          sort_order
        FROM banners
        WHERE is_active = TRUE
          AND (valid_until IS NULL OR valid_until > NOW())
        ORDER BY sort_order ASC
        LIMIT 5
      `);

      // 2. VOUCHERS - Ưu đãi nổi bật
      const [vouchers] = await db.query(`
        SELECT
          id,
          code,
          title,
          description,
          discount_type,
          discount_value,
          min_order_amount,
          valid_until,
          CASE
            WHEN (valid_until::date - CURRENT_DATE) <= 3 THEN TRUE
            ELSE FALSE
          END as is_expiring_soon
        FROM vouchers
        WHERE is_active = TRUE
          AND (valid_until IS NULL OR valid_until > NOW())
        ORDER BY valid_until ASC
        LIMIT 4
      `);

      // Transform vouchers to match frontend expectations
      const transformedVouchers = vouchers.map(v => ({
        ...v,
        expiry: v.valid_until,
        condition: v.min_order_amount > 0
          ? `Đơn từ ${new Intl.NumberFormat('vi-VN').format(v.min_order_amount)}đ`
          : 'Không giới hạn đơn'
      }));

      // 3. FEATURED PRODUCTS - Sản phẩm nổi bật (SẢN PHẨM MỚI)
      const [featuredProducts] = await db.query(`
        SELECT
          p.id, p.name, p.slug, p.short_description,
          p.price, p.compare_price, p.stock, p.total_sold, p.gender,
          p.is_featured, p.material,
          c.name as category_name, c.slug as category_slug,
          b.name as brand_name, b.slug as brand_slug,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT AVG(rating) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as avg_rating,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) as review_count
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE p.is_active = TRUE AND p.is_featured = TRUE
        ORDER BY p.created_at DESC
        LIMIT 8
      `);

      // 4. HOMEWEAR PRODUCTS - Sản phẩm homewear (4 sản phẩm)
      const [homewearProducts] = await db.query(`
        SELECT
          p.id, p.name, p.slug, p.short_description,
          p.price, p.compare_price, p.stock, p.total_sold, p.gender,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url,
          (SELECT COUNT(*) FROM product_reviews WHERE product_id = p.id AND is_approved = TRUE AND is_active = TRUE) > 0 as is_online_exclusive
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = TRUE
          AND c.slug = 'homewear'
        ORDER BY p.created_at DESC
        LIMIT 4
      `);

      // 5. T-SHIRT PRODUCTS - 4 sản phẩm
      const [tshirtProducts] = await db.query(`
        SELECT
          p.id, p.name, p.slug, p.short_description,
          p.price, p.compare_price, p.stock, p.total_sold, p.gender,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = TRUE
          AND c.slug = 'tshirt'
        ORDER BY p.created_at DESC
        LIMIT 4
      `);

      // 6. VÁY PRODUCTS - 4 sản phẩm
      const [vayProducts] = await db.query(`
        SELECT
          p.id, p.name, p.slug, p.short_description,
          p.price, p.compare_price, p.stock, p.total_sold, p.gender,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image_url
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = TRUE
          AND c.slug = 'vay'
        ORDER BY p.created_at DESC
        LIMIT 4
      `);

      // 7. COLLECTIONS - Bộ sưu tập
      const [collections] = await db.query(`
        SELECT
          id, title, slug, description, image, cta, cta_text, sort_order
        FROM collections
        WHERE is_active = TRUE AND is_featured = TRUE
        ORDER BY sort_order ASC
        LIMIT 3
      `);

      // 8. CATEGORIES (CategoryRow) - Dòng hàng nổi bật
      const [categories] = await db.query(`
        SELECT
          id, name, slug, image, icon, description
        FROM categories
        WHERE is_active = TRUE AND is_featured = TRUE
        ORDER BY sort_order ASC
        LIMIT 4
      `);

      // 9. NEWS/BLOG - Tin tức
      const [news] = await db.query(`
        SELECT
          id, title, slug, summary, thumbnail, thumbnail as image_url, category, tags,
          view_count, author_name, published_at
        FROM news
        WHERE is_published = TRUE
          AND deleted_at IS NULL
          AND published_at IS NOT NULL
          AND published_at <= NOW()
        ORDER BY published_at DESC
        LIMIT 5
      `);

      // Response
      res.json({
        success: true,
        data: {
          banners: banners.length > 0 ? banners : getDefaultBanners(),
          vouchers: transformedVouchers.length > 0 ? transformedVouchers : getDefaultVouchers(),
          featuredProducts: featuredProducts.map(enrichProduct),
          homewearProducts: homewearProducts.map(enrichProduct),
          tshirtProducts: tshirtProducts.map(enrichProduct),
          vayProducts: vayProducts.map(enrichProduct),
          collections: collections.length > 0 ? collections : getDefaultCollections(),
          categories: categories.length > 0 ? categories : getDefaultCategories(),
          news
        }
      });

    } catch (error) {
      console.error('Error fetching home data:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tải dữ liệu trang chủ'
      });
    }
  }
};

function enrichProduct(product) {
  const discountPercent = (product.compare_price && product.compare_price > product.price)
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : 0;

  const primaryImage = product.image_url || 'https://via.placeholder.com/400x533';
  const images = product.images?.length > 0
    ? product.images
    : primaryImage
      ? [primaryImage]
      : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'];

  return {
    ...product,
    images,
    avg_rating: parseFloat(product.avg_rating) || 0,
    review_count: parseInt(product.review_count) || 0,
    discount_percent: discountPercent,
    image_url: primaryImage,
    is_on_sale: discountPercent > 0,
    is_out_of_stock: product.stock === 0
  };
}

function getDefaultBanners() {
  return [
    { id: 1, title: '', slug: '', image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/2/8/2880x960007052026.webp', link_url: null, description: '' },
    { id: 2, title: '', slug: '', image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/a/o/aophong-desk-210326.webp', link_url: null, description: '' },
    { id: 3, title: 'Banner SS', slug: 'banner-ss', image: 'http://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/s/s/ssnd_topbanner_desktop-020526.webp', link_url: null, description: '' }
  ];
}

function getDefaultVouchers() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const twoMonths = new Date(now);
  twoMonths.setMonth(twoMonths.getMonth() + 2);

  return [
    { id: 1, code: 'VOUCHER100K', title: 'Voucher 100K', description: 'Giảm 100k cho đơn từ 799k', discount_type: 'fixed_amount', discount_value: 100000, min_order_amount: 799000, valid_until: tomorrow.toISOString().slice(0, 19).replace('T', ' '), is_expiring_soon: true, expiry: tomorrow.toISOString().slice(0, 19).replace('T', ' '), condition: 'Đơn từ 799.000đ' },
    { id: 2, code: 'VOUCHER200K', title: 'Voucher 200K', description: 'Giảm 200k cho đơn từ 1.099k', discount_type: 'fixed_amount', discount_value: 200000, min_order_amount: 1099000, valid_until: tomorrow.toISOString().slice(0, 19).replace('T', ' '), is_expiring_soon: true, expiry: tomorrow.toISOString().slice(0, 19).replace('T', ' '), condition: 'Đơn từ 1.099.000đ' },
    { id: 3, code: 'VOUCHER50K', title: 'Voucher 50K', description: 'Giảm 50k cho đơn từ 399k', discount_type: 'fixed_amount', discount_value: 50000, min_order_amount: 399000, valid_until: twoMonths.toISOString().slice(0, 19).replace('T', ' '), is_expiring_soon: false, expiry: twoMonths.toISOString().slice(0, 19).replace('T', ' '), condition: 'Đơn từ 399.000đ' },
    { id: 4, code: 'NEWUSER80K', title: 'Voucher 80K', description: 'Giảm 80k cho đơn Online đầu tiên', discount_type: 'fixed_amount', discount_value: 80000, min_order_amount: 0, valid_until: twoMonths.toISOString().slice(0, 19).replace('T', ' '), is_expiring_soon: false, expiry: twoMonths.toISOString().slice(0, 19).replace('T', ' '), condition: 'Khách hàng mới' }
  ];
}

function getDefaultCollections() {
  return [
    { id: 1, title: 'DORAEMON', image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/d/o/doraemon_bst_homepage-140426.webp', cta: '/collections/doraemon', cta_text: 'Khám phá' },
    { id: 2, title: 'CANIFA S - TỰ HÀO VIỆT NAM', image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/c/a/canifas_bst_homepage-140426.webp', cta: '/collections/canifa-s', cta_text: 'Khám phá' },
    { id: 3, title: 'DISNEY', image: 'https://2885371169.e.cdneverest.net/Simiconnector/BannerSlider/d/i/disney_bst_homepage-140426.webp', cta: '/collections/disney', cta_text: 'Khám phá' }
  ];
}

function getDefaultCategories() {
  return [
    { id: 1, name: 'Áo Thun Nam', slug: 'ao-thun-nam', image: 'https://2885371169.e.cdneverest.net//catalog/category/men-4_3_Ao-phong_Ao-phong-basic.webp', cta: '/ao-thun-nam' },
    { id: 2, name: 'Áo Sơ Mi Nam', slug: 'ao-so-mi-nam', image: 'https://2885371169.e.cdneverest.net//catalog/category/men-6_1_Ao-so-mi_Tat-ca.webp', cta: '/ao-so-mi-nam' },
    { id: 3, name: 'Quần Jeans Nam', slug: 'quan-jeans-nam', image: 'https://2885371169.e.cdneverest.net//catalog/category/men-7_2_Quan_Quan-jeans.webp', cta: '/quan-jeans-nam' },
    { id: 4, name: 'Áo Blouse Nữ', slug: 'ao-blouse-nu', image: 'https://cdn.hstatic.net/products/1000402464/fwbl25fh07c__2__9894f50b0d6f419d849330beb60c5fe6_master.jpg', cta: '/ao-blouse-nu' }
  ];
}
