const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
} = require("../controllers/categoriesController.js");
const verifyToken = require("../middleware/verifyJWT.js");

// GET /categories?user_id=...
router.get("/", verifyToken, getCategories);
router.post("/", verifyToken, createCategory);

module.exports = router;
