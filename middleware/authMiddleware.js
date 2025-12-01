const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  try {
    // 요청 헤더에서 JWT 토큰 가져오기
    const token = req.header('Authorization')?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: '토큰이 없습니다. 접근이 거부되었습니다.' });
    }

    // 토큰 검증
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");

    // 관리자 권한 체크
    if (decodedUser.role !== 'admin') {
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
    }

    // 검증 완료 후 req.user에 정보 추가
    req.user = decodedUser;
    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.', error });
  }
};
