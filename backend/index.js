const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { pool } = require("./db.js");
const { initializeTables } = require("./initializeTables.js");
const { seedTables } = require("./seedTables.js");
const transactionsRouter = require("./routes/transactions.js");
const accountsRouter = require("./routes/accounts.js");
const dashboardRouter = require("./routes/dashboard.js");
const categoriesRouter = require("./routes/categories.js");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ EXACT frontend origin
    credentials: true, // ✅ Allow cookies, etc.
  })
);
app.use(express.json());
app.use(cookieParser());

// Example route
app.get("/", (req, res) => {
  res.send("Express + CORS + PostgreSQL boilerplate");
});

app.use("/auth", require("./routes/auth.js")); // Auth routes for signup and login

app.use("/transactions", transactionsRouter);
app.use("/accounts", accountsRouter);
app.use("/dashboard", dashboardRouter);
app.use("/categories", categoriesRouter);

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
