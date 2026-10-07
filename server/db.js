import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Chuỗi kết nối PostgreSQL
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/haven_3d';

export const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Lỗi bất ngờ trên client kết nối PostgreSQL:', err);
});

/**
 * Thực thi câu truy vấn SQL an toàn
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SQL Query] (${duration}ms) rows=${res.rowCount}`);
    }
    return res;
  } catch (error) {
    console.error(`[SQL Error]: ${error.message} \nQuery: ${text}`);
    throw error;
  }
}

/**
 * Kiểm tra tình trạng kết nối tới cơ sở dữ liệu
 */
export async function checkDbConnection() {
  try {
    const res = await pool.query('SELECT NOW() AS current_time, current_database() AS db_name');
    return {
      connected: true,
      time: res.rows[0].current_time,
      database: res.rows[0].db_name,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
}

