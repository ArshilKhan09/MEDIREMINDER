const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ error: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ Always attach user.id
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ error: "Token is not valid" });
  }
}

module.exports = auth;
