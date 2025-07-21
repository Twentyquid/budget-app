const express = require("express");
const router = express.Router();
const {
  getRecentTransactions,
  submitTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionsController.js");

// GET /transactions/recent?user_id=...
router.get("/recent", getRecentTransactions);

// POST /transactions/submit
router.post("/submit", submitTransaction);

// PUT /transactions/update
router.put("/update", updateTransaction);

// DELETE /transactions/delete
router.delete("/delete", deleteTransaction);

module.exports = router;
