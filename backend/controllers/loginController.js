const { pool } = require("../db.js"); // Assuming you have a db.js file for database connection
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND password_hash = $2",
      [username, password]
    );
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",
      accessToken,
      userId: user.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" + err.message });
  }
};

module.exports = { handleLogin };
