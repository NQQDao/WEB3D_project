import { Router } from 'express';
import { query, pool } from '../db.js';

const router = Router();

// POST /api/orders
router.post('/', async (req, res) => {
  const { userId, customerName, customerEmail, customerPhone, shippingAddress, items, total, discount, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Giỏ hàng đang trống, không thể đặt hàng!' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderCode = `HV-${Date.now().toString().slice(-6)}`;
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const orderRes = await client.query(
      `INSERT INTO orders (order_code, user_id, customer_name, customer_email, customer_phone, shipping_address, subtotal, discount_amount, total_amount, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, order_code, total_amount, created_at`,
      [
        orderCode,
        userId || null,
        customerName || 'Khách hàng Haven',
        customerEmail || 'customer@havenhome.vn',
        customerPhone || '0900000000',
        shippingAddress || 'Giao hàng và lắp đặt tận nhà',
        subtotal,
        discount || 0,
        total || subtotal,
        paymentMethod || 'cod',
      ]
    );

    const order = orderRes.rows[0];

    // Thêm các món trong đơn hàng
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, finish_name, finish_color_hex, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          order.id,
          item.productId,
          item.name,
          item.customization?.finishName || null,
          item.customization?.swatchColor || null,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );
    }

    await client.query('COMMIT');
    return res.json({ success: true, order });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Lỗi POST /api/orders:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tạo đơn hàng.' });
  } finally {
    client.release();
  }
});

// GET /api/orders?userId=...
router.get('/', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId là bắt buộc!' });
  }

  try {
    const ordersRes = await query(
      `SELECT o.id, o.order_code, o.total_amount, o.order_status, o.created_at,
              COUNT(oi.id) AS item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.json({ success: true, orders: ordersRes.rows });
  } catch (error) {
    console.error('Lỗi GET /api/orders:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tải lịch sử đơn hàng.' });
  }
});

export default router;

