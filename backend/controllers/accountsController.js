const { pool } = require("../db.js");

const addAccount = async (req, res) => {
  const { user_id, name, type, balance } = req.body;
  if (!user_id || !name || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO accounts (user_id, name, type, balance)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, name, type, balance || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getAccountsByUser = async (req, res) => {
  const userId = req.query.user_id || req.body.user_id;
  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM accounts WHERE user_id = $1 ORDER BY id`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addAccount, getAccountsByUser };
