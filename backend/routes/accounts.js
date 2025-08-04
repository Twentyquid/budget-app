const express = require("express");
const router = express.Router();
const {
  addAccount,
  getAccountsByUser,
} = require("../controllers/accountsController.js");
const verifyToken = require("../middleware/verifyJWT.js");

// POST /accounts/add
router.route("/add").post(verifyToken, addAccount);

// GET /accounts/all?user_id=...
router.route("/all").get(verifyToken, getAccountsByUser);

module.exports = router;
