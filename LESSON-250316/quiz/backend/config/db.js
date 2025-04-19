require('dotenv').config();
const mongoose = require('mongoose');

const uri = "mongodb+srv://lsh6166:r8aYUxtsrTZR0Uv0@cluster0.tuvkvl5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
console.log('📦 Mongo URI:', uri);

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
