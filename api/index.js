// Cua vao Serverless Function tren Vercel.
// vercel.json dinh tuyen moi /api/* ve day; Express nhan duoc URL goc
// nen cac route app.use('/api', ...) van khop binh thuong.
module.exports = require('../backend/src/app');
