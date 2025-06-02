require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const adminWordRoutes = require("./routes/adminWordRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

// ✅ 프론트 빌드된 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ 환경 변수에서 포트 가져오기
const PORT = process.env.PORT || 8090;

// ✅ 데이터베이스 연결
connectDB();

// ✅ 미들웨어 설정
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// ✅ 라우트 설정
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/admin", adminWordRoutes);
app.use("/v1/api", quizRoutes);

// ✅ Vue SPA를 위한 fallback (모든 경로 → index.html)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// ✅ 서버 실행 및 포트 출력
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중! 포트: ${PORT}`);
});

module.exports = app;
