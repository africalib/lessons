const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { loginId, loginPw, lickname } = req.body;

    //비밀번호 해싱
    const hashedPassword = await bcrypt.hash(loginPw, 10);

    const newUser = new User({
      loginId,
      loginPw: hashedPassword,
      lickname,
      role: 'user'
    });

    await newUser.save();
    res.status(201).json({ message: '회원가입 성공'});
  } catch (error) {
    res.status(500).json({ meesage: '회원가입 실패', error });
  }
};

exports.login = async (req, res) => {
  try {
    const { loginId, loginPw } = req.body;
    const user = await User.findOne({ loginId });

    if (!user || !(await bcrypt.compare(loginPw, user.loginPw))) {
      return res.status(400).json({ message: '아이디 또는 비밀번호가 틀립니다.' });
    }

    // JWT 토큰 생성 (role 포함)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: '로그인 성공', token });
  } catch (error) {
    res.status(500).json({ message: '로그인 실패', error });
  }
};