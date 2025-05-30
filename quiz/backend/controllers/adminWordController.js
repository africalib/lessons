const Word = require('../models/Word');

exports.getWords = async (req, res) => {
  try {
    const words = await Word.find();
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: '단어 목록 조회 실패', error });
  }
};

exports.getWordById = async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ message: '단어를 찾을 수 없습니다.' });
    }
    res.json(word);
  } catch (error) {
    res.status(500).json({ message: '단어 조회 실패', error });
  }
};

exports.createWord = async (req, res) => {
  try {
    const { title, desc } = req.body;

    // 중복 단어 방지
    const existingWord = await Word.findOne({ title });
    if (existingWord) {
      return res.status(400).json({ message: '이미 등록된 단어입니다.' });
    }

    const newWord = new Word({ title, desc, createdBy: req.user.userId });
    await newWord.save();

    res.status(201).json({ message: '단어 등록 성공!', word: newWord });
  } catch (error) {
    res.status(500).json({ message: '단어 등록 실패', error });
  }
};

exports.updateWord = async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!word) {
      return res.status(404).json({ message: '수정할 단어를 찾을 수 없습니다.' });
    }

    res.json({ message: '단어 수정 성공!', word });
  } catch (error) {
    res.status(500).json({ message: '단어 수정 실패', error });
  }
};

exports.deleteWord = async (req, res) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);

    if (!word) {
      return res.status(404).json({ message: '삭제할 단어를 찾을 수 없습니다.' });
    }

    res.json({ message: '단어 삭제 완료' });
  } catch (error) {
    res.status(500).json({ message: '단어 삭제 실패', error });
  }
};
