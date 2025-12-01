const express = require('express');
const { getWords, getWordById, createWord, updateWord, deleteWord } = require('../controllers/adminWordController');
const { auth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/words', getWords);  // 단어 목록 조회
router.get('/words/:id', getWordById);  // 단어 상세 조회
router.post('/words', auth, createWord);  // 단어 등록 (관리자)
router.put('/words/:id', auth, updateWord);  // 단어 수정 (관리자)
router.delete('/words/:id', auth, deleteWord);  // 단어 삭제 (관리자)

module.exports = router;
