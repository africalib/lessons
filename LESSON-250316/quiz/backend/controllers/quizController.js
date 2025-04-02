const Word = require("../models/Word");
const QuizAnswer = require("../models/QuizAnswer");

// 1. 랜덤 퀴즈 조회
exports.getRandomQuiz = async (req, res) => {
    const words = await Word.aggregate([{ $sample: { size: 4 } }]);
    if (words.length < 4) return res.status(400).json({ message: "단어 부족" });

    const correctWord = words[Math.floor(Math.random() * 4)];
    const options = words.map((w) => w.desc);
    const shuffled = options
        .map((v) => ({ v, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map((x) => x.v);
    const correctIndex = shuffled.indexOf(correctWord.desc);

    // 정답 정보를 함께 보낼 필요 없음. id는 Word 기준
    res.json({
        quizId: correctWord._id,
        question: `"${correctWord.title}"의 뜻은 무엇인가요?`,
        options: shuffled,
    });
};

// 2. 퀴즈 답변 제출
exports.submitAnswer = async (req, res) => {
    const { id } = req.params; // Word ID
    const { userId, selectedIndex, options } = req.body;

    const word = await Word.findById(id);
    if (!word) return res.status(404).json({ message: "단어 없음" });

    const correctIndex = options.indexOf(word.desc);
    const isCorrect = correctIndex === selectedIndex;

    const saved = await QuizAnswer.create({
        userId,
        wordId: word._id,
        question: `"${word.title}"의 뜻은 무엇인가요?`,
        options,
        correctIndex,
        selectedIndex,
        isCorrect,
    });

    res.status(201).json({
        message: "제출 완료",
        isCorrect,
        answer: word.desc,
        savedId: saved._id,
    });
};

// 3. 사용자 퀴즈 제출 목록
exports.getUserAnswers = async (req, res) => {
    const { userId } = req.params;
    const answers = await QuizAnswer.find({ userId }).sort({ createdAt: -1 });
    res.json(answers);
};

// 4. 퀴즈 제출 상세
exports.getAnswerDetail = async (req, res) => {
    const { userId, id } = req.params;
    const answer = await QuizAnswer.findOne({ _id: id, userId });
    if (!answer) return res.status(404).json({ message: "기록 없음" });
    res.json(answer);
};
