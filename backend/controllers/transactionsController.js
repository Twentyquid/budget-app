const { pool } = require("../db.js");

const getRecentTransactions = async (req, res) => {
  const userId = req.query.user_id || req.body.user_id;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = parseInt(req.query.offset, 10) || 0;
  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_date DESC, id DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const submitTransaction = async (req, res) => {
  const {
    user_id,
    account_id,
    category_id,
    amount,
    type,
    description,
    transaction_date,
  } = req.body;

  if (
    !user_id ||
    !account_id ||
    !category_id ||
    !amount ||
    !type ||
    !transaction_date
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        user_id,
        account_id,
        category_id,
        amount,
        type,
        description || "",
        transaction_date,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateTransaction = async (req, res) => {
  const {
    id,
    account_id,
    category_id,
    amount,
    type,
    description,
    transaction_date,
  } = req.body;

  if (
    !id ||
    !account_id ||
    !category_id ||
    !amount ||
    !type ||
    !transaction_date
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET account_id = $2,
           category_id = $3,
           amount = $4,
           type = $5,
           description = $6,
           transaction_date = $7
       WHERE id = $1
       RETURNING *`,
      [
        id,
        account_id,
        category_id,
        amount,
        type,
        description || "",
        transaction_date,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Transaction id is required" });
  }
  try {
    const result = await pool.query(
      "DELETE FROM transactions WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted", transaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getRecentTransactions,
  submitTransaction,
  updateTransaction,
  deleteTransaction,
};
