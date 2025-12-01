const Word = require("../models/Word");
const QuizAnswer = require("../models/QuizAnswer");

// 1) ランダムクイズを取得
exports.getRandomQuiz = async (req, res) => {
  try {
    // データベース内の単語数を確認
    const wordCount = await Word.countDocuments();
    console.log(`📊 データベース内の単語数: ${wordCount}`);
    
    if (wordCount < 4) {
      console.warn(`⚠️ 単語が不足しています。必要: 4個、現在: ${wordCount}個`);
      return res.status(400).json({ 
        message: `単語が不足しています。少なくとも4個の単語が必要です（現在: ${wordCount}個）。` 
      });
    }

    const words = await Word.aggregate([{ $sample: { size: 4 } }]);
    console.log(`✅ ${words.length}個の単語を取得しました`);
    
    if (words.length < 4) {
      console.warn(`⚠️ サンプリング結果が不足: ${words.length}個`);
      return res.status(400).json({ 
        message: `単語の取得に失敗しました（取得: ${words.length}個、必要: 4個）。` 
      });
    }

    const correctWord = words[Math.floor(Math.random() * 4)];
    const options = words.map((w) => w.desc);
    const shuffled = options
      .map((v) => ({ v, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.v);
    
    console.log(`✅ クイズ生成成功: ${correctWord.title}`);
    res.json({
      quizId: correctWord._id,
      question: `"${correctWord.title}"の意味は何ですか？`,
      options: shuffled,
    });
  } catch (err) {
    console.error("❌ getRandomQuiz エラー:", err);
    res.status(500).json({ message: "サーバーエラーが発生しました。", error: err.message });
  }
};

// 2) クイズの回答を提出
exports.submitAnswer = async (req, res) => {
  const { id: wordId } = req.params;
  const { selectedIndex, options } = req.body;
  const userId = req.user?.userId; // 認証ミドルウェアがある場合
  const answer = options[selectedIndex]?.trim();

  if (typeof selectedIndex !== "number") {
    return res.status(400).json({ message: "selectedIndexの値が無効です。" });
  }

  try {
    const word = await Word.findById(wordId);

    if (!word)
      return res.status(404).json({ message: "単語が見つかりませんでした。" });

    const isCorrect = word.desc === answer;

    const saved = await QuizAnswer.create({
      userId,
      wordId: word._id,
      submittedContent: answer,
      correctContent: word.desc,
      isCorrect,
    });

    res.status(201).json({
      message: "提出が完了しました。",
      isCorrect,
      answer: word.desc,
      savedId: saved._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// 3) ユーザーのクイズ提出履歴を取得（ページング）
exports.getUserAnswers = async (req, res) => {
  const { userId } = req.params;
  const num = parseInt(req.query.num, 10) || 1;
  const take = parseInt(req.query.take, 10) || 15;
  if (num < 1 || take < 1) {
    return res
      .status(400)
      .json({ message: "numとtakeは1以上の数字でなければなりません。" });
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
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};

// 4) クイズ提出の詳細を取得
exports.getAnswerDetail = async (req, res) => {
  const { userId, id } = req.params;
  try {
    const answer = await QuizAnswer.findOne({ _id: id, userId }).lean();
    if (!answer) {
      return res.status(404).json({ message: "記録が見つかりませんでした。" });
    }
    res.json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
};
