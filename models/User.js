const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  loginId: { type: String, required: true, unique: true },
  loginPw: { type: String, required: true },
  nickname: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
