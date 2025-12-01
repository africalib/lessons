const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const auth = require("../middleware/authMiddleware");
const userAuth = require("../middleware/userMiddleware");

// 퀴즈 API
router.get("/quizzes/random", quizController.getRandomQuiz);
router.post("/quizzes/:id/answers", userAuth, quizController.submitAnswer);

// 사용자 API
router.get("/users/:userId/answers", quizController.getUserAnswers);
router.get("/users/:userId/answers/:id", quizController.getAnswerDetail);

module.exports = router;
