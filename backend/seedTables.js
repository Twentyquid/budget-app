const { pool } = require("./db.js");

const seedTables = async () => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM users");
    const count = parseInt(result.rows[0].count);
    if (count > 0) {
      console.log("Tables already seeded");
      return;
    }
    console.log("Seeding tables...");
    // Insert users
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES 
         ('Alice', 'alice@example.com', 'hashedpassword1'),
         ('Bob', 'bob@example.com', 'hashedpassword2')
       RETURNING id`
    );
    const [aliceId, bobId] = userResult.rows.map((row) => row.id);

    // Insert categories (default and user-specific)
    await pool.query(
      `INSERT INTO categories (name, type, is_default, user_id)
       VALUES 
         ('Salary', 'income', TRUE, NULL),
         ('Groceries', 'expense', TRUE, NULL),
          ('Food', 'expense', TRUE, NULL),
          ('Fuel', 'expense', TRUE, NULL),
          ('Utilities', 'expense', TRUE, NULL),
         ('Freelance', 'income', FALSE, $1),
         ('Dining', 'expense', FALSE, $2)`,
      [aliceId, bobId]
    );

    // Insert accounts
    await pool.query(
      `INSERT INTO accounts (user_id, name, type, balance)
       VALUES 
         ($1, 'Cash Wallet', 'Cash', 1000.00),
         ($2, 'Bank Account', 'Bank', 5000.00)`,
      [aliceId, bobId]
    );

    // Insert transactions
    // Insert transactions for two weeks
    await pool.query(
      `INSERT INTO transactions (user_id, account_id, category_id, amount, type, description, transaction_date)
       VALUES 
       ($1, 1, 1, 2000.00, 'income', 'Monthly salary', CURRENT_DATE - INTERVAL '14 days'),
       ($2, 2, 2, 150.00, 'expense', 'Grocery shopping', CURRENT_DATE - INTERVAL '13 days'),
       ($1, 1, 3, 500.00, 'income', 'Freelance project', CURRENT_DATE - INTERVAL '12 days'),
       ($2, 2, 4, 60.00, 'expense', 'Dining out', CURRENT_DATE - INTERVAL '11 days'),
       ($1, 1, 2, 80.00, 'expense', 'Groceries', CURRENT_DATE - INTERVAL '10 days'),
       ($2, 2, 2, 120.00, 'expense', 'Grocery shopping', CURRENT_DATE - INTERVAL '9 days'),
       ($1, 1, 3, 300.00, 'income', 'Freelance gig', CURRENT_DATE - INTERVAL '8 days'),
       ($2, 2, 4, 40.00, 'expense', 'Dining out', CURRENT_DATE - INTERVAL '7 days'),
       ($1, 1, 2, 90.00, 'expense', 'Groceries', CURRENT_DATE - INTERVAL '6 days'),
       ($2, 2, 2, 130.00, 'expense', 'Grocery shopping', CURRENT_DATE - INTERVAL '5 days'),
       ($1, 1, 3, 250.00, 'income', 'Freelance task', CURRENT_DATE - INTERVAL '4 days'),
       ($2, 2, 4, 55.00, 'expense', 'Dining out', CURRENT_DATE - INTERVAL '3 days'),
       ($1, 1, 2, 70.00, 'expense', 'Groceries', CURRENT_DATE - INTERVAL '2 days'),
       ($2, 2, 2, 140.00, 'expense', 'Grocery shopping', CURRENT_DATE - INTERVAL '1 day')
      `,
      [aliceId, bobId]
    );

    console.log("Tables seeded successfully");
  } catch (error) {
    console.error("Error seeding tables:", error);
    process.exit(1);
  }
};

module.exports = { seedTables };
