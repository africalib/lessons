const User = require("../models/User"); // モデルの読み込み
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.join = async (req, res) => {
  try {
    const { loginId, loginPw, nickname } = req.body;
    
    console.log("会員登録リクエスト:", { loginId, loginPw: loginPw ? "***" : undefined, nickname });
    
    // 入力検証
    if (!loginId || !loginPw || !nickname) {
      console.log("入力検証失敗:", { loginId: !!loginId, loginPw: !!loginPw, nickname: !!nickname });
      return res.status(400).json({ message: "すべてのフィールドを入力してください。" });
    }
    
    // 空文字列チェック
    if (loginId.trim() === "" || loginPw.trim() === "" || nickname.trim() === "") {
      return res.status(400).json({ message: "すべてのフィールドを入力してください。" });
    }
    
    // 重複チェック
    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      console.log("重複ユーザー検出:", loginId);
      return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
    }
    
    const hashedPassword = await bcrypt.hash(loginPw, 10);
    const newUser = new User({ loginId, loginPw: hashedPassword, nickname });
    const savedUser = await newUser.save();
    console.log("✅ 会員登録成功:", { 
      userId: savedUser._id, 
      loginId: savedUser.loginId, 
      nickname: savedUser.nickname,
      role: savedUser.role 
    });
    res.status(201).json({ message: "会員登録に成功しました！" });
  } catch (error) {
    console.error("❌ 会員登録エラー:", error);
    
    // MongoDB重複エラーの処理
    if (error.code === 11000) {
      return res.status(400).json({ message: "このメールアドレスは既に登録されています。" });
    }
    
    // バリデーションエラーの処理
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "入力データが無効です。", errors: error.errors });
    }
    
    res.status(500).json({ message: "会員登録に失敗しました", error: error.message });
  }
};

exports.info = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
      res.status(200).json({
        userId: decodedUser.userId,
        role: decodedUser.role || "user"
      });
      return;
    } catch (e) {
      console.error("Token verification error:", e);
    }
  }

  res.status(200).send(null);
};

exports.login = async (req, res) => {
  try {
    const { loginId, loginPw } = req.body;
    
    console.log("ログインリクエスト:", { loginId, loginPw: loginPw ? "***" : undefined });
    
    // 入力検証
    if (!loginId || !loginPw) {
      console.log("入力検証失敗:", { loginId: !!loginId, loginPw: !!loginPw });
      return res.status(400).json({ message: "IDとパスワードを入力してください。" });
    }
    
    // 空文字列チェック
    if (loginId.trim() === "" || loginPw.trim() === "") {
      return res.status(400).json({ message: "IDとパスワードを入力してください。" });
    }
    
    // ユーザー検索
    const user = await User.findOne({ loginId });
    console.log("ユーザー検索結果:", user ? { id: user._id, loginId: user.loginId, nickname: user.nickname, role: user.role } : "ユーザーが見つかりません");
    
    if (!user) {
      console.log("❌ ユーザーが見つかりません:", loginId);
      return res.status(400).json({ message: "IDまたはパスワードが間違っています。" });
    }

    // パスワード検証
    const isPasswordValid = await bcrypt.compare(loginPw, user.loginPw);
    console.log("パスワード検証結果:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log("❌ パスワードが間違っています:", loginId);
      return res.status(400).json({ message: "IDまたはパスワードが間違っています。" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role || "user" },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    console.log("✅ ログイン成功:", { userId: user._id, loginId: user.loginId, role: user.role || "user" });
    res.json({ message: "ログインに成功しました", token });
  } catch (error) {
    console.error("❌ ログインエラー:", error);
    res.status(500).json({ message: "ログインに失敗しました", error: error.message });
  }
};

// ログアウト: Cookieのtokenを削除
exports.logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ message: "ログアウトに成功しました！" });
};
