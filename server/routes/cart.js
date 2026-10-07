import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/cart?userId=...
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    let cartRes;
    if (userId) {
      cartRes = await query('SELECT * FROM carts WHERE user_id = $1 LIMIT 1', [userId]);
    }

    if (!cartRes || cartRes.rows.length === 0) {
      return res.json({ success: true, cart: { items: [], voucher: null, subtotal: 0, total: 0 } });
    }

    const cart = cartRes.rows[0];
    const itemsRes = await query('SELECT * FROM cart_items WHERE cart_id = $1 ORDER BY created_at ASC', [cart.id]);

    let voucher = null;
    if (cart.voucher_code) {
      const vRes = await query('SELECT * FROM vouchers WHERE code = $1', [cart.voucher_code]);
      if (vRes.rows.length > 0) voucher = vRes.rows[0];
    }

    const items = itemsRes.rows.map((r) => ({
      id: r.id,
      productId: r.product_id,
      name: r.name,
      category: r.category,
      price: parseFloat(r.unit_price),
      priceFormatted: `$${parseFloat(r.unit_price).toLocaleString()}`,
      quantity: r.quantity,
      customization: r.finish_key
        ? {
            finishKey: r.finish_key,
            finishName: r.finish_name,
            swatchColor: r.swatch_color,
          }
        : null,
    }));

    return res.json({ success: true, cart: { id: cart.id, items, voucher } });
  } catch (error) {
    console.error('Lỗi GET /api/cart:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi đọc giỏ hàng.' });
  }
});

// POST /api/cart/items
router.post('/items', async (req, res) => {
  const { userId, product, finish } = req.body;

  if (!product) {
    return res.status(400).json({ success: false, message: 'Thông tin sản phẩm là bắt buộc!' });
  }

  const numericPrice = typeof product.price === 'string'
    ? parseFloat(product.price.replace(/[^0-9.]/g, ''))
    : product.price;

  const finishKey = finish?.key || 'standard';
  const itemId = `${product.id}_${finishKey}`;

  try {
    // Tìm hoặc tạo giỏ hàng cho user
    let cartId;
    if (userId) {
      let cartRes = await query('SELECT id FROM carts WHERE user_id = $1', [userId]);
      if (cartRes.rows.length === 0) {
        let newCart = await query('INSERT INTO carts (user_id) VALUES ($1) RETURNING id', [userId]);
        cartId = newCart.rows[0].id;
      } else {
        cartId = cartRes.rows[0].id;
      }
    } else {
      let guestCart = await query('INSERT INTO carts DEFAULT VALUES RETURNING id');
      cartId = guestCart.rows[0].id;
    }

    // Upsert món đồ vào cart_items
    await query(
      `INSERT INTO cart_items (id, cart_id, product_id, name, category, finish_key, finish_name, swatch_color, quantity, unit_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, $9)
       ON CONFLICT (id) DO UPDATE
       SET quantity = cart_items.quantity + 1`,
      [
        itemId,
        cartId,
        product.id,
        product.name,
        product.category,
        finish?.key || null,
        finish?.name || null,
        finish?.colorHex || finish?.swatchColor || null,
        numericPrice,
      ]
    );

    return res.json({ success: true, message: 'Đã thêm vào giỏ hàng thành công!' });
  } catch (error) {
    console.error('Lỗi POST /api/cart/items:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi thêm sản phẩm vào giỏ.' });
  }
});

// POST /api/cart/voucher
router.post('/voucher', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập mã giảm giá!' });
  }

  try {
    const vRes = await query(
      `SELECT * FROM vouchers WHERE code = $1 AND is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW())`,
      [code.trim().toUpperCase()]
    );

    if (vRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn!' });
    }

    return res.json({ success: true, voucher: vRes.rows[0] });
  } catch (error) {
    console.error('Lỗi POST /api/cart/voucher:', error);
    return res.status(500).json({ success: false, message: 'Lỗi kiểm tra mã giảm giá.' });
  }
});

export default router;

