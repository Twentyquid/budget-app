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

const createCategory = async (req, res) => {
  const userId = req.userId;
  const { name, type } = req.body;
  if (!userId || !name || !type) {
    return res.status(400).json({ error: "insufficient data" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO categories(name, type, user_id)
      VALUES($1, $2, $3) RETURNING *`,
      [name, type, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" + err.message });
  }
};

module.exports = { getCategories, createCategory };
