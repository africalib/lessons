const User = require("../models/User"); // 모델 불러오기
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.join = async (req, res) => {
  try {
    const { loginId, loginPw, nickname } = req.body;
    const hashedPassword = await bcrypt.hash(loginPw, 10);
    const newUser = new User({ loginId, loginPw: hashedPassword, nickname });
    await newUser.save();
    res.status(201).json({ message: "회원가입 성공!" });
  } catch (error) {
    res.status(500).json({ message: "회원가입 실패", error });
  }
};

exports.info = async (req, res) => {
  const token = req.header('Authorization')?.replace("Bearer ", "");

  if (token) {
    try {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
      res.status(200).send(decodedUser.userId);
      return;
    } catch (e) {
    }
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
        .json({ message: "아이디 또는 비밀번호가 틀립니다." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "로그인 성공", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "로그인 실패", error });
  }
};

// 로그아웃: 쿠키에서 token 삭제
exports.logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ message: "로그아웃 성공!" });
};
