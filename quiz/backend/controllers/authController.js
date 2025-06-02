const User = require("../models/User"); // モデルの読み込み
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.join = async (req, res) => {
  try {
    const { loginId, loginPw, nickname } = req.body;
    const hashedPassword = await bcrypt.hash(loginPw, 10);
    const newUser = new User({ loginId, loginPw: hashedPassword, nickname });
    await newUser.save();
    res.status(201).json({ message: "会員登録に成功しました！" });
  } catch (error) {
    res.status(500).json({ message: "会員登録に失敗しました", error });
  }
};

exports.info = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const decodedUser = jwt.verify(token, "your_jwt_secret");
      res.status(200).send(decodedUser.userId);
      return;
    } catch (e) {}
  }

  res.status(200).send(null);
};

exports.login = async (req, res) => {
  try {
    const { loginId, loginPw } = req.body;
    const user = await User.findOne({ loginId });

    if (!user || !(await bcrypt.compare(loginPw, user.loginPw))) {
      return res
        .status(400)
        .json({ message: "IDまたはパスワードが間違っています。" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "ログインに成功しました", token });
  } catch (error) {
    res.status(500).json({ message: "ログインに失敗しました", error });
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
