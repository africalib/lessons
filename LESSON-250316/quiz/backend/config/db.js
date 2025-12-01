require("dotenv").config();
const mongoose = require("mongoose");

// 環境変数から設定を取得
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "quiz";

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI環境変数が設定されていません。");
  process.exit(1);
}

// MongoDB URIにデータベース名を追加
const connectionString = MONGO_URI.endsWith("/")
  ? `${MONGO_URI}${DB_NAME}`
  : `${MONGO_URI}/${DB_NAME}`;

console.log("📦 Mongo URI:", connectionString.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")); // パスワードを隠す

const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log(`✅ MongoDB接続成功（データベース: ${DB_NAME}）`);
  } catch (error) {
    console.error("❌ MongoDB接続失敗:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
