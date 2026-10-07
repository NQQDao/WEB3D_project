import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// 1. GET /api/admin/stats - KPI & 3D Analytics Overview
router.get('/stats', async (req, res) => {
  try {
    // A. Tổng doanh thu & số đơn hàng
    const orderStats = await query(`
      SELECT 
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COUNT(id) AS total_orders,
        COUNT(CASE WHEN order_status = 'pending' THEN 1 END) AS pending_orders,
        COUNT(CASE WHEN order_status = 'completed' THEN 1 END) AS completed_orders
      FROM orders
    `);

    // B. Tổng số khách hàng
    const userStats = await query(`SELECT COUNT(id) AS total_customers FROM users`);

    // C. Tổng số không gian 3D đã lưu
    const roomStats = await query(`SELECT COUNT(id) AS total_saved_rooms FROM saved_rooms`);

    // D. 3D Popularity breakdown
    const popularityStats = [
      { id: 'hotspot-sofa', name: 'Sofa Luna Curve Lounge', views: 1420, ordersCount: 38, percent: 62 },
      { id: 'hotspot-table', name: 'Bàn Trà Arlo Fluted', views: 890, ordersCount: 24, percent: 22 },
      { id: 'hotspot-chair', name: 'Ghế Thư Giãn Terra', views: 560, ordersCount: 16, percent: 11 },
      { id: 'hotspot-lamp', name: 'Đèn Cây Halo Arc Brass', views: 420, ordersCount: 12, percent: 5 },
    ];

    const finishPopularity = [
      { key: 'cream', name: 'Kem Bouclé (Ivory)', colorHex: '#f3ece0', share: 45 },
      { key: 'cognac', name: 'Da Bò Cognac (Leather)', colorHex: '#9e522c', share: 32 },
      { key: 'sage', name: 'Xanh Rêu Velvet (Olive)', colorHex: '#485844', share: 15 },
      { key: 'charcoal', name: 'Xám Khói Slate (Charcoal)', colorHex: '#2b2e34', share: 8 },
    ];

    return res.json({
      success: true,
      stats: {
        totalRevenue: parseFloat(orderStats.rows[0]?.total_revenue || 0),
        totalOrders: parseInt(orderStats.rows[0]?.total_orders || 0, 10),
        pendingOrders: parseInt(orderStats.rows[0]?.pending_orders || 0, 10),
        completedOrders: parseInt(orderStats.rows[0]?.completed_orders || 0, 10),
        totalCustomers: parseInt(userStats.rows[0]?.total_customers || 0, 10),
        totalSavedRooms: parseInt(roomStats.rows[0]?.total_saved_rooms || 0, 10),
        popularityStats,
        finishPopularity,
      },
    });
  } catch (error) {
    console.error('Lỗi GET /api/admin/stats:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy dữ liệu thống kê admin.' });
  }
});

// 2. GET /api/admin/orders - Danh sách tất cả đơn hàng kèm chi tiết cấu hình 3D
router.get('/orders', async (req, res) => {
  try {
    const ordersRes = await query(`
      SELECT 
        o.id, o.order_code, o.customer_name, o.customer_email, o.customer_phone,
        o.shipping_address, o.subtotal, o.discount_amount, o.total_amount,
        o.order_status, o.payment_method, o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
    `);

    const orders = ordersRes.rows;

    // Lấy chi tiết các món trong từng đơn hàng
    for (const order of orders) {
      const itemsRes = await query(`
        SELECT product_id, product_name, finish_name, finish_color_hex, quantity, unit_price, total_price
        FROM order_items
        WHERE order_id = $1
      `, [order.id]);

      order.items = itemsRes.rows;
    }

    return res.json({ success: true, orders });
  } catch (error) {
    console.error('Lỗi GET /api/admin/orders:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách đơn hàng admin.' });
  }
});

// 3. PATCH /api/admin/orders/:id/status - Cập nhật trạng thái đơn hàng
router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'delivering', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Trạng thái đơn hàng không hợp lệ!' });
  }

  try {
    const result = await query(
      `UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING id, order_code, order_status`,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
    }

    return res.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error('Lỗi PATCH /api/admin/orders/:id/status:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái đơn hàng.' });
  }
});

// 4. GET /api/admin/vouchers - Danh sách mã giảm giá
router.get('/vouchers', async (req, res) => {
  try {
    const vouchersRes = await query(`
      SELECT code, discount_percent, discount_amount, description, is_active, max_uses, used_count, expires_at
      FROM vouchers
      ORDER BY created_at DESC
    `);
    return res.json({ success: true, vouchers: vouchersRes.rows });
  } catch (error) {
    console.error('Lỗi GET /api/admin/vouchers:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách voucher.' });
  }
});

// 5. POST /api/admin/vouchers - Tạo mã giảm giá mới
router.post('/vouchers', async (req, res) => {
  const { code, discountPercent, discountAmount, description, maxUses, expiresAt } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Mã voucher không được để trống!' });
  }

  try {
    const newVoucher = await query(
      `INSERT INTO vouchers (code, discount_percent, discount_amount, description, max_uses, expires_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING code, discount_percent, discount_amount, description, is_active, max_uses, used_count`,
      [
        code.trim().toUpperCase(),
        discountPercent || 0,
        discountAmount || 0,
        description || 'Mã ưu đãi Haven & Home',
        maxUses || null,
        expiresAt || null,
      ]
    );

    return res.json({ success: true, voucher: newVoucher.rows[0] });
  } catch (error) {
    console.error('Lỗi POST /api/admin/vouchers:', error);
    return res.status(500).json({ success: false, message: 'Mã voucher này đã tồn tại hoặc xảy ra lỗi tạo mới.' });
  }
});

// 6. PATCH /api/admin/vouchers/:code/toggle - Bật/tắt voucher
router.patch('/vouchers/:code/toggle', async (req, res) => {
  const { code } = req.params;

  try {
    const result = await query(
      `UPDATE vouchers SET is_active = NOT is_active WHERE code = $1 RETURNING code, is_active`,
      [code.toUpperCase()]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy voucher!' });
    }

    return res.json({ success: true, voucher: result.rows[0] });
  } catch (error) {
    console.error('Lỗi PATCH /api/admin/vouchers/:code/toggle:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi bật/tắt voucher.' });
  }
});

// 7. DELETE /api/admin/vouchers/:code - Xóa voucher
router.delete('/vouchers/:code', async (req, res) => {
  const { code } = req.params;

  try {
    await query(`DELETE FROM vouchers WHERE code = $1`, [code.toUpperCase()]);
    return res.json({ success: true, message: `Đã xóa mã voucher ${code}` });
  } catch (error) {
    console.error('Lỗi DELETE /api/admin/vouchers/:code:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi xóa voucher.' });
  }
});

// 8. GET /api/admin/customers - Danh sách khách hàng & Không gian đã lưu
router.get('/customers', async (req, res) => {
  try {
    const customersRes = await query(`
      SELECT 
        u.id, u.name, u.email, u.avatar_url, u.created_at,
        COUNT(DISTINCT sr.id) AS saved_rooms_count,
        COUNT(DISTINCT o.id) AS total_orders_count,
        COALESCE(SUM(o.total_amount), 0) AS total_spent
      FROM users u
      LEFT JOIN saved_rooms sr ON u.id = sr.user_id
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    return res.json({ success: true, customers: customersRes.rows });
  } catch (error) {
    console.error('Lỗi GET /api/admin/customers:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tải danh sách khách hàng.' });
  }
});

export default router;
