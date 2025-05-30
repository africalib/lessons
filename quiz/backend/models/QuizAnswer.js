const mongoose = require("mongoose");

const quizAnswerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    wordId: { type: mongoose.Types.ObjectId, ref: "Word", required: true },
    submittedContent: { type: String, required: true },
    correctContent: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAnswer", quizAnswerSchema);
