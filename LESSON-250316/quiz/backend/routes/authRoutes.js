const express = require('express');
const { join, login } = require('../controllers/authController');

const router = express.Router();

router.post('/join', join);
router.post('/login', login);

module.exports = router;
