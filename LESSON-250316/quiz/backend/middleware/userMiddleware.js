const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "トークンがありません。ログインしてください。" });
    }

    const decoded = jwt.verify(token, "your_jwt_secret");

    console.log("✅ decoded token:", decoded);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "無効なトークンです。" });
  }
};

module.exports = userAuth;
