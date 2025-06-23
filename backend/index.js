const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection setup
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://user:password@localhost:5432/mydb",
});

// Test DB connection
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("PostgreSQL connection error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Express + CORS + PostgreSQL boilerplate");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
