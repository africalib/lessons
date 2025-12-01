const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true, validate: val => val.length === 4 },
  correctAnswer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
