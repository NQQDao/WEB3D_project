import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/rooms?userId=...
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    let result;
    if (userId) {
      result = await query(
        `SELECT id, room_name AS name, finish_key AS "finishKey", finish_name AS "finishName",
                lighting_mode AS "lightingMode", lighting_name AS "lightingName",
                TO_CHAR(created_at, 'YYYY-MM-DD') AS date
         FROM saved_rooms
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );
    } else {
      result = await query(
        `SELECT id, room_name AS name, finish_key AS "finishKey", finish_name AS "finishName",
                lighting_mode AS "lightingMode", lighting_name AS "lightingName",
                TO_CHAR(created_at, 'YYYY-MM-DD') AS date
         FROM saved_rooms
         ORDER BY created_at DESC
         LIMIT 10`
      );
    }

    return res.json({ success: true, rooms: result.rows });
  } catch (error) {
    console.error('Lỗi GET /api/rooms:', error);
    return res.status(500).json({ success: false, message: 'Lỗi khi tải không gian 3D.' });
  }
});

// POST /api/rooms
router.post('/', async (req, res) => {
  const { userId, name, finishKey, finishName, lightingMode, lightingName } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ success: false, message: 'userId và name là bắt buộc!' });
  }

  try {
    const insertRes = await query(
      `INSERT INTO saved_rooms (user_id, room_name, finish_key, finish_name, lighting_mode, lighting_name)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, room_name AS name, finish_key AS "finishKey", finish_name AS "finishName",
                 lighting_mode AS "lightingMode", lighting_name AS "lightingName",
                 TO_CHAR(created_at, 'YYYY-MM-DD') AS date`,
      [userId, name, finishKey || 'cream', finishName || 'Kem Bouclé', lightingMode || 'day', lightingName || 'Ban Ngày']
    );

    return res.json({ success: true, room: insertRes.rows[0] });
  } catch (error) {
    console.error('Lỗi POST /api/rooms:', error);
    return res.status(500).json({ success: false, message: 'Không thể lưu không gian 3D.' });
  }
});

// DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await query('DELETE FROM saved_rooms WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Đã xóa không gian 3D thành công!' });
  } catch (error) {
    console.error('Lỗi DELETE /api/rooms/:id:', error);
    return res.status(500).json({ success: false, message: 'Không thể xóa phòng mẫu.' });
  }
});

export default router;

