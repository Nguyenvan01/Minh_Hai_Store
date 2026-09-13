// Diem khoi dong khi chay local (npm run dev / npm start).
// Tren Vercel khong dung file nay - xem api/index.js o goc repo.
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
