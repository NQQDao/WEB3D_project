import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDbConnection } from './db.js';
import authRoutes from './routes/auth.js';
import roomsRoutes from './routes/rooms.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck & Database Status
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkDbConnection();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Khởi động server
app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`🚀 Haven & Home Backend Server chạy tại: http://localhost:${PORT}`);
  console.log(`📡 API Healthcheck: http://localhost:${PORT}/api/health`);
  console.log('====================================================');

  const dbStatus = await checkDbConnection();
  if (dbStatus.connected) {
    console.log(`✅ Kết nối PostgreSQL thành công! (Database: "${dbStatus.database}")`);
  } else {
    console.warn(`⚠️ Chưa thể kết nối PostgreSQL (${dbStatus.error}).`);
    console.warn('💡 Hệ thống Frontend sẽ tự động chuyển sang chế độ dự phòng Offline (LocalStorage) mượt mà!');
  }
});

