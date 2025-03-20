require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const wordRoutes = require('./routes/wordRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// DB 연결
connectDB();

// 미들웨어
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// 라우트
app.use('v1/api/auth', authRoutes);
app.use('v1/api/admin', adminRoutes);
app.use('v1/api/question', wordRoutes);

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
