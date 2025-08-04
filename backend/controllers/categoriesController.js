const { pool } = require("../db.js");

const getCategories = async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }
  try {
    const result = await pool.query(
      `SELECT id, name, type, is_default, user_id
       FROM categories
       WHERE is_default = TRUE OR user_id = $1
       ORDER BY type, name`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getCategories };
