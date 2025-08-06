const { pool } = require("../db.js");

const getDashboardData = async (req, res) => {
  const userId = req.userId;
  // const accountId = req.query.account_id || req.body.account_id;

  if (!userId) {
    return res.status(400).json({ error: "user_id is required" });
  }
  try {
    // Current balance (sum of all account balances)
    const balanceResult = await pool.query(
      `select user_id,
(select SUM(balance) from accounts where user_id = $1) +
sum(case when type = 'income' then amount else 0 end) -
sum(case when type='expense' then amount else 0 end) as current_balance
from transactions 
where user_id = $1
group by user_id`,
      [userId]
    );
    const current_balance = balanceResult.rows[0];

    // Average daily spending (last 30 days)
    const avgSpendingResult = await pool.query(
      `SELECT ROUND(COALESCE(SUM(daily_total),0) / COUNT(*),2) AS avg_spending FROM (
         SELECT SUM(amount) AS daily_total
         FROM transactions
         WHERE user_id = $1 AND type = 'expense' AND transaction_date >= CURRENT_DATE - INTERVAL '30 days'
         GROUP BY transaction_date
       );`,
      [userId]
    );
    const avg_spending = avgSpendingResult.rows[0].avg_spending;

    // Weekly summary (from the PL/pgSQL function)
    const weeklySummaryResult = await pool.query(
      `SELECT * FROM weekly_summary($1) ORDER BY dow`,
      [userId]
    );
    const weekly_summary = weeklySummaryResult.rows;

    // Top categories (by spending, last 30 days)
    const topCategoriesResult = await pool.query(
      `SELECT c.name, SUM(t.amount) AS total_spent
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.type = 'expense' AND t.transaction_date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY c.name
       ORDER BY total_spent DESC
       LIMIT 5`,
      [userId]
    );
    const top_categories = topCategoriesResult.rows;

    // Current month's total expense
    const monthExpenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS month_expense
       FROM transactions
       WHERE user_id = $1
         AND type = 'expense'
         AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)`,
      [userId]
    );
    const month_expense = monthExpenseResult.rows[0].month_expense;

    // Recent 5 transactions
    const recentTransactionsResult = await pool.query(
      `SELECT t.id, c.name AS category_name, t.amount, t.type, t.transaction_date
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC, t.id DESC
       LIMIT 4`,
      [userId]
    );
    const recent_transactions = recentTransactionsResult.rows;

    res.json({
      current_balance,
      avg_spending,
      weekly_summary,
      top_categories,
      month_expense,
      recent_transactions,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getDashboardData };
