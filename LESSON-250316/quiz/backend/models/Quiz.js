const mongoose = require('mongoose');
require('dotenv').config();

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: val => val.length === 4 },
  correctAnswer: { type: String, required: true },
}, { timestamps: true });

// 환경 변수에서 컬렉션 이름 가져오기 (기본값: quizzes)
const collectionName = process.env.COLLECTION_NAME || 'quizzes';

module.exports = mongoose.model('Quiz', QuizSchema, collectionName);
