const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    // リクエストヘッダーからJWTトークンを取得
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "トークンがありません。アクセスが拒否されました。" });
    }

    // トークンを検証
    const decodedUser = jwt.verify(token, "your_jwt_secret");

    // 管理者権限のチェック
    if (decodedUser.role !== "admin") {
      return res.status(403).json({ message: "管理者権限が必要です。" });
    }

    // 検証完了後、req.userに情報を追加
    req.user = decodedUser;
    next();
  } catch (error) {
    res.status(401).json({ message: "無効なトークンです。", error });
  }
};
