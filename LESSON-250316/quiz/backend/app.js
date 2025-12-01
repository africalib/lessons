require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminWordRoutes = require("./routes/adminWordRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

// ✅ 環境変数からポートを取得
const PORT = process.env.PORT || 8090;

// ✅ データベース接続
connectDB();

// ✅ CORS設定（本番環境では指定されたVercel URLのみ許可）
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    // originがない場合（同一ドメインリクエスト、Postmanなど）許可
    if (!origin) {
      return callback(null, true);
    }

    // 末尾のスラッシュを削除して比較
    const cleanOrigin = origin.replace(/\/+$/, "");

    // 明示的に許可されたoriginか確認
    if (allowedOrigins.indexOf(cleanOrigin) !== -1) {
      return callback(null, true);
    }

    // VercelプレビューURLパターン（例: https://quiz-xxx-username.vercel.app）
    const vercelPreviewPattern = /^https:\/\/quiz(-[\w-]+)*\.vercel\.app$/;
    if (vercelPreviewPattern.test(cleanOrigin)) {
      return callback(null, true);
    }

    // Vercel本番URLパターン（例: https://quiz-app-xxx.vercel.app）
    const vercelProductionPattern = /^https:\/\/quiz-app[\w-]*\.vercel\.app$/;
    if (vercelProductionPattern.test(cleanOrigin)) {
      return callback(null, true);
    }

    console.warn(`❌ CORS: 許可されていないorigin: ${cleanOrigin}`);
    console.warn(`✅ 許可されたorigins: ${allowedOrigins.join(", ")}`);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// ✅ ミドルウェア設定
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan("dev"));

// ✅ ルートパス - ヘルスチェック
app.get("/", (req, res) => {
  res.json({
    message: "Quiz API Server is running",
    status: "ok",
    endpoints: {
      test: "/v1/api/tests/connection",
      auth: "/v1/api/auth",
      quizzes: "/v1/api/quizzes",
    },
  });
});

// ✅ ルート設定
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/admin", adminWordRoutes);
app.use("/v1/api", quizRoutes);

// ✅ サーバー実行とポート出力
app.listen(PORT, () => {
  console.log(`🚀 サーバー実行中！ポート: ${PORT}`);
});

module.exports = app;
