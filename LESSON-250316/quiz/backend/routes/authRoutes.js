const express = require("express");
const { join, info, login, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/join", join);
router.post("/login", login);
router.get("/info", info);
router.post("/logout", logout);

module.exports = router;
