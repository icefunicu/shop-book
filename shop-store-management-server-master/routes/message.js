// 留言相关
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
// 删除留言
router.post("/deleteMessage", messageController.deleteMessage);
// 获取留言
router.post("/getMessages", messageController.getMessages);

module.exports = router;