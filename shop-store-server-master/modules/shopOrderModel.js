const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopOrderListSchema = sequelize.import("../schema/shopOrderListSchema");
const shopSubOrderListSchema = sequelize.import("../schema/shopSubOrderListSchema");
const shopUserCartListSchema = sequelize.import("../schema/shopUserCartListSchema");
const shopDeliveryCompanySchema = sequelize.import("../schema/shopDeliveryCompanySchema");
const shopUserDeliveryAddressSchema = sequelize.import("../schema/shopUserDeliveryAddressSchema");
const shopRefundRecordSchema = sequelize.import("../schema/shopRefundRecordSchema");
const bookListSchema = sequelize.import("../schema/bookListSchema");
const getUncertainSqlObj = require("./../utils/utils").getUncertainSqlObj;

class shopOrderModel {
  /**
   * 分页查询订单列表
   *
   * @static
   */
  static async getOrderList(parmas, userId) {
    let {
      pageSize,
      pageNumber,
      status
    } = parmas;
    let searchObj = getUncertainSqlObj({
      status
    });
    shopOrderListSchema.hasMany(shopSubOrderListSchema, {
      foreignKey: "mainOrderId",
      sourceKey: "id",
      as: {
        singular: "orders",
        plural: "orders"
      }
    });
    let result = await shopOrderListSchema.findAndCountAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        userId,
        ...searchObj
      },
      include: [{
        model: shopSubOrderListSchema,
        as: "orders"
      }],
      order: [
        ["id", "DESC"]
      ],
      distinct: true
    });
    return {
      pageSize,
      pageNumber,
      rows: result.rows,
      total: result.count
    };
  }

  /**
   * 根据订单id查询订单
   * @param id
   * @param userId
   * @returns {Promise<*>}
   */
  static async getOrderByOrderId(id, userId) {
    shopOrderListSchema.hasMany(shopSubOrderListSchema, {
      foreignKey: "mainOrderId",
      sourceKey: "id",
      as: {
        singular: "orders",
        plural: "orders"
      }
    });
    return await shopOrderListSchema.findOne({
      where: {
        id,
        userId
      },
      include: [{
        model: shopSubOrderListSchema,
        as: "orders"
      }],
      distinct: true
    });
  }


  /**
   * 获取子订单信息
   *
   * @static
   * @param {*} idsArr 子订单idsArr
   * @returns
   */
  static async getSubOrderInfo(idsArr) {
    return await shopUserCartListSchema.findAll({
      where: {
        id: {
          [Op.in]: idsArr
        }
      }
    });
  }

  /**
   * 生成订单
   *
   * @static
   * @param {*} param
   * @returns
   */
  static async createOrder(param) {
    return await shopOrderListSchema.create(param);
  }

  /**
   * 生成子订单
   *
   * @static
   * @param {*} paramsArr
   * @returns
   */
  static async createSubOrder(paramsArr) {
    return await shopSubOrderListSchema.bulkCreate(paramsArr);
  }

  /**
   * 更新库存
   *
   * @static
   * @returns
   * @param id 书籍id
   * @param reduceCount 减少的数量
   */
  static async updateStock(id, reduceCount) {
    let str = `-${reduceCount}`;
    return await bookListSchema.update({
      stock: sequelize.literal("`stock` " + str),
      updatedAt: new Date()
    }, {
      where: {
        id
      }
    });
  }

  /**
   * 订单付款完成
   *
   * @static
   * @returns
   * @param orderId
   */
  static async updateOrderPayment(orderId) {
    return await shopOrderListSchema.update({
      status: 1,
      dealAt: new Date()
    }, {
      where: {
        orderId,
        status: 0
      }
    });
  }

  /**
   * 订单退款
   *
   * @static
   * @returns
   * @param params
   */
  static async submitRefundOrder(params) {
    let {id, remark, userId} = params;
    return await shopOrderListSchema.update({
      status: 6,
      remark,
      updatedAt: new Date()
    }, {
      where: {
        id,
        userId,
        status: {
          [Op.in]: [1, 2, 3, 4, 5]
        }
      }
    });
  }

  /**
   * 确认收货
   *
   * @static
   * @returns
   * @param params
   */
  static async submitOrderComplete(params) {
    let {id, userId} = params;
    return await shopOrderListSchema.update({
      status: 5,
      updatedAt: new Date()
    }, {
      where: {
        id,
        userId,
        status: {
          [Op.in]: [3, 4]
        }
      }
    });
  }
}


module.exports = shopOrderModel;
