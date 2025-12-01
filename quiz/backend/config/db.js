require("dotenv").config();
const mongoose = require("mongoose");

// ✅ .env에서 URI 불러오기
const uri = process.env.MONGO_URI;
console.log("📦 Mongo URI:", uri ? "Loaded" : "Not found!");

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB 연결 성공");
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
