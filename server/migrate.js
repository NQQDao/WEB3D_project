import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkDbConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  console.log('🔄 Đang kiểm tra kết nối tới cơ sở dữ liệu PostgreSQL...');
  const health = await checkDbConnection();

  if (!health.connected) {
    console.error('❌ Không thể kết nối tới PostgreSQL!');
    console.error(`Chi tiết lỗi: ${health.error}`);
    console.error('💡 Vui lòng kiểm tra lại dịch vụ PostgreSQL hoặc chuỗi DATABASE_URL trong file .env');
    process.exit(1);
  }

  console.log(`✅ Kết nối thành công! Database: "${health.database}" lúc ${health.time}`);
  console.log('🚀 Đang tiến hành chạy migration (schema.sql)...');

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(sql);

    console.log('🎉 Migration hoàn tất thành công!');
    console.log('✨ Đã tạo đầy đủ các bảng: users, products, product_finishes, saved_rooms, vouchers, carts, cart_items, orders, order_items.');
    console.log('✨ Đã nạp dữ liệu mẫu ban đầu.');
  } catch (error) {
    console.error('❌ Lỗi khi thực thi migration SQL:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();

