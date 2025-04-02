const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

// 퀴즈 API
router.get("/random", quizController.getRandomQuiz);
router.post("/quizzes/:id/answer", quizController.submitAnswer);
router.get("/users/:userId/answers", quizController.getUserAnswers);
router.get("/users/:userId/answers/:id", quizController.getAnswerDetail);

module.exports = router;
