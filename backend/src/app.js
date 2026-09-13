const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const homeRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const adminAuthRoutes = require('./routes/adminAuth');
const customerRoutes = require('./routes/customer');

const app = express();

// Vercel dat app sau proxy - can cho express-rate-limit doc dung IP
app.set('trust proxy', 1);

// Serve uploaded files - chi chay local, tren Vercel filesystem chi doc
if (!process.env.VERCEL) {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

// Security middleware - Disable CSP for development (allows Vite HMR)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS - tren Vercel frontend va API cung origin nen khong can CORS.
// CORS_ORIGIN chi dung khi deploy frontend rieng mot domain khac.
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api', customerRoutes);

// Health check - /api/health dung tren Vercel, /health giu cho local
const health = (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
};
app.get('/api/health', health);
app.get('/health', health);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy API.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.status && err.status < 500
      ? (err.message || 'Yêu cầu không hợp lệ.')
      : 'Có lỗi xảy ra, vui lòng thử lại sau.'
  });
});

module.exports = app;
