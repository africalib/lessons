const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myDatabase");
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
