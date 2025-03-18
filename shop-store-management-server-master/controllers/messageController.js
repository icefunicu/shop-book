const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const messageModel = require("../modules/messageModel");

class MessageController {
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
      if (hasEmpty(req.body.id)) {
        res.json(resMsg(9001));
        return false;
      }
      await messageModel.deleteMessage(req.body.id);
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

}

module.exports = MessageController;
