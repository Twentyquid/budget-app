const express = require("express");
const cors = require("cors");
const { pool } = require("./db.js");
const { initializeTables } = require("./initializeTables.js");
const { seedTables } = require("./seedTables.js");
const transactionsRouter = require("./routes/transactions.js");
const accountsRouter = require("./routes/accounts.js");
const dashboardRouter = require("./routes/dashboard.js");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Express + CORS + PostgreSQL boilerplate");
});

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
      username,
      password,
    ]);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password]
    );
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/transactions", transactionsRouter);
app.use("/accounts", accountsRouter);
app.use("/dashboard", dashboardRouter);

const startServer = async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL");
    await initializeTables();
    await seedTables();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    process.exit(1);
  }
};
startServer();
