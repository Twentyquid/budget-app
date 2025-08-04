const express = require("express");
const router = express.Router();

const { handleSignUp } = require("../controllers/signUpController.js");
const { handleLogin } = require("../controllers/loginController.js");
const {
  handleRefreshToken,
} = require("../controllers/refreshTokenController.js");

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.get("/refresh", handleRefreshToken);

module.exports = router;
