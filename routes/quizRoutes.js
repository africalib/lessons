const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { auth } = require('../middleware/authMiddleware');

// 퀴즈 API
router.get("/quizzes/random", auth, quizController.getRandomQuiz);
router.post("/quizzes/:id/answers", auth, quizController.submitAnswer);

// 사용자 API
router.get("/users/:userId/answers", auth, quizController.getUserAnswers);
router.get("/users/:userId/answers/:id", auth, quizController.getAnswerDetail);

module.exports = router;
