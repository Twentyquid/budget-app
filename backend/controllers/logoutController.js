const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
