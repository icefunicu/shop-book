const { where } = require('sequelize');
const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const campusSchema = sequelize.import("../schema/campusSchema");

class campusModel {
    /**
     * 添加校园资讯
     * @param {Object} campusInfo - 校园资讯信息
     * @returns {Promise} - 返回添加结果
     */
    static async addCampus(campusInfo) {
        return await campusSchema.create(campusInfo);
    }

    /**
     * 编辑校园资讯
     * @param {Object} campusInfo - 校园资讯信息
     * @param {Number} id - 校园资讯ID
     * @returns {Promise} - 返回更新结果
     */
    static async editCampus(campusInfo, id) {
        return await campusSchema.update(campusInfo, {
            where: { id }
        });
    }

    /**
     * 删除校园资讯
     * @param {Number} id - 校园资讯ID
     * @returns {Promise} - 返回删除结果
     */
    static async deleteCampus(id) {
        // 直接删除对应记录
        return await campusSchema.destroy({
            where: { id }
        });
    }

    /**
     * 获取校园资讯列表 根据创建时间倒序
     * @returns {Promise} - 返回查询结果
     */
    static async getCampusList() {
        //直接返回
        return await campusSchema.findAll({
            order: [['create_time', 'DESC']]
        });
    }
    /**
     * 获取校园资讯列表 
     * @returns {Promise} - 返回查询结果
     */
    static async getCampusOne() {
        //返回最新的一条
        return await campusSchema.findOne({
            order: [['create_time', 'DESC']],
            where : { status : 1}
        });
    }
}

module.exports = campusModel;
