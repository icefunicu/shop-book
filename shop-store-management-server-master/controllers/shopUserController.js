const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const getRandomPwd = require("../utils/utils").getRandomPwd;
const shopUserModel = require("../modules/shopUserModel");
const adminUserModel = require("../modules/adminUserModel");
const crypto = require("crypto");

class shopUserController {
  /**
   * 获取店铺用户信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopUserController
   */
  static async getShopUserInfo(req, res, next) {
    try {
      if (hasEmpty(req.body.pageSize, req.body.pageNumber)) {
        res.json(resMsg(9001));
        return false;
      }
      // 将adminuser和shopuser数据合并一起返回给前端
      let adminUserResult = await adminUserModel.getAllUserInfo();
      let UserResult = await shopUserModel.getShopUserInfo(req.body);
      // 将两个result拼接到一个对象中
      let result = {
        adminUserResult,
        UserResult
      };
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
 * 编辑用户信息
 *
 * @static
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @memberof shopUserController
 */
  static async editUserInfo(req, res, next) {
    try {
      if (hasEmpty(req.session.loginId, req.body.name, req.body.email)) {
        res.json(resMsg(9001));
        return false;
      }
      // 如果有usertype字段，说明是adminuser表，如果没有说明是shopuser表
      if (req.body.usertype == 1) {
        await adminUserModel.updateById({

          email: req.body.email,
          nickname : req.body.nickname
        }, req.body.id);
      } else {
        await shopUserModel.update({
          id: req.body.id,

          email: req.body.email,
          nickname : req.body.nickname
        });
      }
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 查询用户收货地址
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof shopUserController
   */
  static async getUserDeliveryAddress(req, res, next) {
    try {
      if (hasEmpty(req.body.userId)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopUserModel.getUserDeliveryAddress(req.body.userId);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 根据id获取收货地址信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopUserController
   */
  static async getOrderAddressById(req, res, next) {
    try {
      if (hasEmpty(req.body.id)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopUserModel.getOrderAddressById(req.body.id);
      res.json(resMsg(200, result[0]));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 更新账号状态
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopUserController
   */
  static async changeUserStatus(req, res, next) {
    try {
      if (hasEmpty(req.body.id, req.body.status) || (req.body.status != 0 && req.body.status != 1)) {
        res.json(resMsg(9001));
        return false;
      }
      // 如果有usertype字段，说明是adminuser表，如果没有说明是shopuser表
      if (req.body.usertype == 1) {
        await adminUserModel.updateById({
          status: req.body.status
        }, req.body.id);
      } else {
        await shopUserModel.update({
          id: req.body.id,
          status: req.body.status
        });
      }
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 重置用户密码 返回随机生成的密码
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopUserController
   */
  static async resetUserPwd(req, res, next) {
    try {
      if (hasEmpty(req.body.id)) {
        res.json(resMsg(9001));
        return false;
      }
      // 如果有usertype字段，说明是adminuser表，如果没有说明是shopuser表
      if (req.body.usertype == 1) {
        await adminUserModel.updateById({
          pwd: hashPwd
        }, req.body.id);
      } else {
        await shopUserModel.update({
          id: req.body.id,
          pwd: hashPwd
        });
      }
      let buffer = new Buffer.from(ranPwd);
      res.json(resMsg(200, {
        newPwd: buffer.toString("base64")
      }));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = shopUserController;
