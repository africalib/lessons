require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const adminWordRoutes = require("./routes/adminWordRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

// ✅ 환경 변수에서 포트 가져오기
const PORT = process.env.PORT || 8090;

// ✅ 데이터베이스 연결
connectDB();

// ✅ CORS 설정 (프로덕션에서는 Vercel URL만 허용)
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200
};

// ✅ 미들웨어 설정
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

// ✅ 루트 경로 - 헬스 체크
app.get("/", (req, res) => {
    res.json({ 
        message: "Quiz API Server is running",
        status: "ok",
        endpoints: {
            test: "/v1/api/tests/connection",
            auth: "/v1/api/auth",
            quizzes: "/v1/api/quizzes"
        }
    });
});

// ✅ 라우트 설정
app.use("/v1/api/tests", testRoutes);
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/admin", adminWordRoutes);
app.use("/v1/api", quizRoutes);

// ✅ 서버 실행 및 포트 출력
app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중! 포트: ${PORT}`);
});

module.exports = app;
