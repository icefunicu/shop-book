// 留言相关
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// 添加留言
router.post("/addMessage", messageController.addMessage);

module.exports = router;