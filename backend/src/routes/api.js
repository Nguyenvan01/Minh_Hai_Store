const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const productController = require('../controllers/productController');

// GET /api/home - Lấy toàn bộ dữ liệu cho trang chủ
router.get('/home', homeController.getHomeData);

// Product routes
router.get('/products', productController.getProducts);
router.get('/products/search', productController.searchProducts);
router.get('/products/suggested', productController.getSuggestedProducts);
router.get('/products/kids', productController.getKidsProducts);
router.get('/products/kids-categories', productController.getKidsCategories);
router.get('/products/:slug', productController.getProductBySlug);

// News/Blog routes
router.get('/news', async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    let query = `
      SELECT id, title, slug, summary, thumbnail, thumbnail as image_url, category, tags,
             view_count, author_name, published_at
      FROM news
      WHERE is_published = TRUE
        AND deleted_at IS NULL
        AND published_at IS NOT NULL
        AND published_at <= NOW()
    `;
    const params = [];
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY published_at DESC LIMIT ?';
    params.push(parseInt(limit));
    const [rows] = await require('../config/database').query(query, params);
    res.json({ success: true, news: rows });
  } catch (err) {
    console.error('Get news error:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

router.get('/news/:slug', async (req, res) => {
  try {
    const [[article]] = await require('../config/database').query(
      `SELECT n.*, n.thumbnail as image_url FROM news n WHERE n.slug = ? AND n.is_published = TRUE AND n.deleted_at IS NULL AND n.published_at <= NOW()`,
      [req.params.slug]
    );
    if (!article) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    }
    await require('../config/database').query(
      'UPDATE news SET view_count = view_count + 1 WHERE id = ?',
      [article.id]
    );
    res.json({ success: true, article });
  } catch (err) {
    console.error('Get news detail error:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
