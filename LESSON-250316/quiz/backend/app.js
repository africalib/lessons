require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const adminWordRoutes = require('./routes/adminWordRoutes');

const app = express();

// ✅ 환경 변수에서 포트 가져오기
const PORT = process.env.PORT || 8090;

// ✅ 데이터베이스 연결
connectDB();

// ✅ 미들웨어 설정
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ✅ 라우트 설정
app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/admin', adminWordRoutes);

// ✅ 서버 실행 및 포트 출력
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중! 포트: ${PORT}`);
});

module.exports = app;
