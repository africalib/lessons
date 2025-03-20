const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  content: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Answer', AnswerSchema);
