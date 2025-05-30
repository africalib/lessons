const Word = require('../models/Word');

exports.test = async (req, res) => {
    const words = await Word.find();
    res.json(words);
};