require('dotenv').config();
const mongoose = require('mongoose');

// 환경 변수에서 설정 가져오기
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'quiz';

if (!MONGO_URI) {
  console.error('❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.');
  process.exit(1);
}

// MongoDB URI에 데이터베이스 이름 추가
const connectionString = MONGO_URI.endsWith('/') 
  ? `${MONGO_URI}${DB_NAME}` 
  : `${MONGO_URI}/${DB_NAME}`;

console.log('📦 Mongo URI:', connectionString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // 비밀번호 숨김
const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log(`✅ MongoDB 연결 성공 (데이터베이스: ${DB_NAME})`);
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
