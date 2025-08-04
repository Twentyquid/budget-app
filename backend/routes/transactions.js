const express = require("express");
const router = express.Router();
const {
  getRecentTransactions,
  submitTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionsController.js");
const verifyToken = require("../middleware/verifyJWT.js");

// GET /transactions/recent?user_id=...
router.get("/recent", verifyToken, getRecentTransactions);

// POST /transactions/submit
router.post("/submit", verifyToken, submitTransaction);

// PUT /transactions/update
router.put("/update", verifyToken, updateTransaction);

// DELETE /transactions/delete
router.delete("/delete", verifyToken, deleteTransaction);

module.exports = router;
