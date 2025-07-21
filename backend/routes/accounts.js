const express = require("express");
const router = express.Router();
const {
  addAccount,
  getAccountsByUser,
} = require("../controllers/accountsController.js");

// POST /accounts/add
router.post("/add", addAccount);

// GET /accounts/all?user_id=...
router.get("/all", getAccountsByUser);

module.exports = router;
