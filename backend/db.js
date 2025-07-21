const { Pool } = require("pg");

const db_url =
  process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mydb";

const pool = new Pool({
  connectionString: db_url,
});

// Test DB connection
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("PostgreSQL connection error:", err));

module.exports = { pool };
