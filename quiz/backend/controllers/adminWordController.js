const Word = require("../models/Word");

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find();
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: "単語リストの取得に失敗しました", error });
  }
};

exports.getWordById = async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ message: "単語が見つかりませんでした。" });
    }
    res.json(word);
  } catch (error) {
    res.status(500).json({ message: "単語の取得に失敗しました", error });
  }
};

exports.createWord = async (req, res) => {
  try {
    const { title, desc } = req.body;

    // 重複単語の防止
    const existingWord = await Word.findOne({ title });
    if (existingWord) {
      return res
        .status(400)
        .json({ message: "すでに登録されている単語です。" });
    }

    const newWord = new Word({ title, desc, createdBy: req.user.userId });
    await newWord.save();

    res
      .status(201)
      .json({ message: "単語の登録に成功しました！", word: newWord });
  } catch (error) {
    res.status(500).json({ message: "単語の登録に失敗しました", error });
  }
};

exports.updateWord = async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!word) {
      return res
        .status(404)
        .json({ message: "修正する単語が見つかりませんでした。" });
    }

    res.json({ message: "単語の修正に成功しました！", word });
  } catch (error) {
    res.status(500).json({ message: "単語の修正に失敗しました", error });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);

    if (!word) {
      return res
        .status(404)
        .json({ message: "削除する単語が見つかりませんでした。" });
    }

    res.json({ message: "単語の削除が完了しました" });
  } catch (error) {
    res.status(500).json({ message: "単語の削除に失敗しました", error });
  }
};
