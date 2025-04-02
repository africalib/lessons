const mongoose = require("mongoose");

const quizAnswerSchema = new mongoose.Schema({
    userId: String, // 사용자 ID
    wordId: mongoose.Schema.Types.ObjectId, // 퀴즈 원본 Word ID
    question: String,
    options: [String],
    correctIndex: Number,
    selectedIndex: Number,
    isCorrect: Boolean,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizAnswer", quizAnswerSchema);
