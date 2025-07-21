const express = require("express");
const router = express.Router();
const { getDashboardData } = require("../controllers/dashboardController.js");

// GET /dashboard?user_id=...
router.get("/", getDashboardData);

module.exports = router;
