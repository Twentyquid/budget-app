const { pool } = require("./db.js");
const initializeTables = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')),
    is_default BOOLEAN DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- NULL means default category
    UNIQUE (user_id, name, type)
);

    CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- e.g. "Cash", "Bank", "UPI"
    balance DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE OR REPLACE FUNCTION weekly_summary(userid int)
    RETURNS TABLE(dow int, previous_week numeric, current_week numeric) AS $$
    BEGIN
        RETURN QUERY
        WITH last_week AS (
            SELECT extract(dow from transaction_date) AS dow, sum(amount) AS previous_spending
            FROM transactions
            WHERE user_id = userid AND type='expense'
              AND transaction_date >= date_trunc('week', current_date) - interval '7 days'
              AND transaction_date < date_trunc('week', current_date)
            GROUP BY dow
        ), this_week AS (
            SELECT extract(dow from transaction_date) AS dow, sum(amount) AS current_spending
            FROM transactions
            WHERE user_id = userid AND type='expense'
              AND transaction_date >= date_trunc('week', current_date)
              AND transaction_date < date_trunc('week', current_date) + interval '7 days'
            GROUP BY dow
        ), week_days AS (
            SELECT generate_series(0,6) AS dow
        )
        SELECT wd.dow,
               coalesce(lw.previous_spending,0) AS previous_week,
               coalesce(tw.current_spending,0) AS current_week
        FROM week_days wd
        LEFT JOIN last_week lw ON wd.dow = lw.dow
        LEFT JOIN this_week tw ON wd.dow = tw.dow;
    END;
    $$ LANGUAGE plpgsql;
        `);
    console.log("Tables initialized successfully");
  } catch (error) {
    console.error("Error initializing tables:", error);
    process.exit(1);
  }
};

module.exports = { initializeTables };
