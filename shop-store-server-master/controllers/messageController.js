const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const messageModel = require("../modules/messageModel");

class MessageController {
  /**
   * 添加留言
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof MessageController
   */
  static async addMessage(req, res, next) {
    try {
      if (hasEmpty(req.session.loginUser, req.body.message)) {
        res.json(resMsg(9001));
        return false;
      }
      await messageModel.addMessage({
        name: req.session.loginUser,
        message: req.body.message,
      });
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 删除留言
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof MessageController
   */
  static async deleteMessage(req, res, next) {
    try {
      if (hasEmpty(req.body.messageId)) {
        res.json(resMsg(9001));
        return false;
      }
      await messageModel.deleteMessage(req.body.messageId);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 获取留言
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof MessageController
   */
  static async getMessages(req, res, next) {
    try {
      let result = await messageModel.getMessages();
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 更新留言
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof MessageController
   */
  static async updateMessage(req, res, next) {
    try {
      if (hasEmpty(req.body.messageId, req.body.content)) {
        res.json(resMsg(9001));
        return false;
      }
      await messageModel.updateMessage({
        messageId: req.body.messageId,
        content: req.body.content
      });
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = MessageController;
