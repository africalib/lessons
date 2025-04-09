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
    const { id } = req.params; // 퀴즈 대상 ID (예: Word ID)
    const { selectedIndex, options } = req.body;

    try {
        // 1. 퀴즈 문제(단어) 찾기
        const word = await Word.findById(id);
        if (!word) {
            return res
                .status(404)
                .json({ message: "문제를 찾을 수 없습니다." });
        }

        // 2. 입력값 유효성 검사
        if (
            !Array.isArray(options) ||
            typeof selectedIndex !== "number" ||
            selectedIndex < 0 ||
            selectedIndex >= options.length
        ) {
            return res
                .status(400)
                .json({ message: "유효하지 않은 요청입니다." });
        }

        // 3. 정답 판단
        const correctIndex = options.indexOf(word.desc);
        const isCorrect = correctIndex === selectedIndex;

        // 4. 결과 저장 (userId 없이 저장)
        const saved = await QuizAnswer.create({
            wordId: word._id,
            question: `"${word.title}"의 뜻은 무엇인가요?`,
            options,
            correctIndex,
            selectedIndex,
            isCorrect,
        });

        // 5. 응답
        return res.status(201).json({
            message: "제출 완료",
            isCorrect,
            answer: word.desc,
            savedId: saved._id,
        });
    } catch (err) {
        console.error("퀴즈 제출 오류:", err);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// // 3. 사용자 퀴즈 제출 목록
// exports.getUserAnswers = async (req, res) => {
//     const { userId } = req.params;
//     const answers = await QuizAnswer.find({ userId }).sort({ createdAt: -1 });
//     res.json(answers);
// };

// // 4. 퀴즈 제출 상세
// exports.getAnswerDetail = async (req, res) => {
//     const { userId, id } = req.params;
//     const answer = await QuizAnswer.findOne({ _id: id, userId });
//     if (!answer) return res.status(404).json({ message: "기록 없음" });
//     res.json(answer);
// };
