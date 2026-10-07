import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email là bắt buộc!' });
  }

  try {
    // Tìm kiếm trong bảng users
    let result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);

    let user;
    if (result.rows.length === 0) {
      // Nếu là lần đầu hoặc tài khoản mẫu, tự động tạo mới
      const formattedName = email.split('@')[0];
      const name = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
      const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=b05e38`;

      const insertRes = await query(
        `INSERT INTO users (email, full_name, avatar_url, role)
         VALUES ($1, $2, $3, 'customer')
         RETURNING id, email, full_name, avatar_url, role, tier, created_at`,
        [email.toLowerCase().trim(), name, avatar]
      );
      user = insertRes.rows[0];
    } else {
      user = result.rows[0];
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        avatar: user.avatar_url,
        tier: user.tier,
      },
    });
  } catch (error) {
    console.error('Lỗi API login:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ kết nối cơ sở dữ liệu.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đủ Họ tên và Email!' });
  }

  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email này đã được đăng ký!' });
    }

    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=b05e38`;
    const insertRes = await query(
      `INSERT INTO users (email, full_name, avatar_url, role)
       VALUES ($1, $2, $3, 'customer')
       RETURNING id, email, full_name, avatar_url, role, tier`,
      [email.toLowerCase().trim(), name.trim(), avatar]
    );

    const user = insertRes.rows[0];
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        avatar: user.avatar_url,
        tier: user.tier,
      },
    });
  } catch (error) {
    console.error('Lỗi API register:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ đăng ký.' });
  }
});

// POST /api/auth/oauth (Google / Apple)
router.post('/oauth', async (req, res) => {
  const { provider } = req.body;
  const name = provider === 'google' ? 'Nguyễn Anh Tuấn' : 'Tuấn Nguyễn (Apple)';
  const email = `${provider}.user@havenhome.vn`;
  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=Tuấn&backgroundColor=b05e38`;

  try {
    let result = await query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (result.rows.length === 0) {
      const insertRes = await query(
        `INSERT INTO users (email, full_name, avatar_url, role)
         VALUES ($1, $2, $3, 'customer')
         RETURNING id, email, full_name, avatar_url, role, tier`,
        [email, name, avatar]
      );
      user = insertRes.rows[0];
    } else {
      user = result.rows[0];
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        avatar: user.avatar_url,
        tier: user.tier,
      },
    });
  } catch (error) {
    console.error('Lỗi API oauth:', error);
    return res.status(500).json({ success: false, message: 'Lỗi xác thực OAuth.' });
  }
});

export default router;

