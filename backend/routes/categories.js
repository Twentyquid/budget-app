const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/categoriesController.js");
const verifyToken = require("../middleware/verifyJWT.js");

// GET /categories?user_id=...
router.get("/", verifyToken, getCategories);

module.exports = router;
