const Word = require("../models/Word");
const QuizAnswer = require("../models/QuizAnswer");

// 1) 랜덤 퀴즈 조회
exports.getRandomQuiz = async (req, res) => {
  try {
    const words = await Word.aggregate([{ $sample: { size: 4 } }]);
    if (words.length < 4) return res.status(400).json({ message: "단어 부족" });

    const correctWord = words[Math.floor(Math.random() * 4)];
    const options = words.map((w) => w.desc);
    const shuffled = options
      .map((v) => ({ v, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.v);
    res.json({
      quizId: correctWord._id,
      question: `"${correctWord.title}"의 뜻은 무엇인가요?`,
      options: shuffled,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 2) 퀴즈 답변 제출
exports.submitAnswer = async (req, res) => {
  const { id: wordId } = req.params;
  const { selectedIndex, options } = req.body;
  const userId = req.user?.userId; // 인증 미들웨어가 붙어 있다면
  const answer = options[selectedIndex]?.trim();

  if (typeof selectedIndex !== "number") {
    return res.status(400).json({ message: "selectedIndex의 값이 유효하지 않습니다." });
  }

  try {
    const word = await Word.findById(wordId);

    if (!word)
      return res.status(404).json({ message: "단어를 찾을 수 없습니다." });

    const isCorrect = word.desc === answer;

    const saved = await QuizAnswer.create({
      userId,
      wordId: word._id,
      submittedContent: answer,
      correctContent: word.desc,
      isCorrect,
    });

    res.status(201).json({
      message: "제출 완료",
      isCorrect,
      answer: word.desc,
      savedId: saved._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 3) 사용자 퀴즈 제출 목록 조회 (페이징)
exports.getUserAnswers = async (req, res) => {
  const { userId } = req.params;
  const num = parseInt(req.query.num, 10) || 1;
  const take = parseInt(req.query.take, 10) || 15;
  if (num < 1 || take < 1) {
    return res
      .status(400)
      .json({ message: "num과 take는 1 이상의 숫자여야 합니다." });
  }

  try {
    const filter = { userId };
    const count = await QuizAnswer.countDocuments(filter);
    const data = await QuizAnswer.find(filter)
      .sort({ createdAt: -1 })
      .skip((num - 1) * take)
      .limit(take)
      .lean();

    res.json({ count, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 4) 퀴즈 제출 상세 조회
exports.getAnswerDetail = async (req, res) => {
  const { userId, id } = req.params;
  try {
    const answer = await QuizAnswer.findOne({ _id: id, userId }).lean();
    if (!answer) {
      return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
    }
    res.json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
