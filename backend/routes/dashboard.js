const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController.js");
const verifyToken = require("../middleware/verifyJWT.js");

// GET /dashboard?user_id=...
router.get("/", verifyToken, getDashboardData);

module.exports = router;
