const express = require("express");
const router = express.Router();

const accountsRoutes = require("./accounts.js");
const transactionsRoutes = require("./transactions.js");
const dashboardRoutes = require("./dashboard.js");
const categoriesRoutes = require("./categories.js");
const authRoutes = require("./auth.js");

router.get("/ping", (req, res) => {
  res.send("server running");
});
router.use("/accounts", accountsRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/categories", categoriesRoutes);
router.use("/auth", authRoutes);

module.exports = router;
