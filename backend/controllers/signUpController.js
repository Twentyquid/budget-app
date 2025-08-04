const { pool } = require("../db.js"); // Assuming you have a db.js file for database connection
const handleSignUp = async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: "Username, password, and email required" });
  }
  try {
    const userExists = await pool.query("SELECT * FROM users WHERE name = $1", [
      username,
    ]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    await pool.query(
      "INSERT INTO users (name,email, password_hash) VALUES ($1, $2, $3)",
      [username, email, password]
    );
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Server error " + err.message });
  }
};

module.exports = { handleSignUp };
