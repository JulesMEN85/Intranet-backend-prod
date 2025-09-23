const express = require("express");
const { sendMessageToGemini } = require("../controllers/chatController");

const router = express.Router();

// 📌 Route pour la ChatBox
router.post("/chat", sendMessageToGemini);

module.exports = router;
