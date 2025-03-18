const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const campusModel = require("../modules/campusModel");

class CampusController {
    /**
     * 添加校园资讯
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     * @returns {Object} - 返回添加结果
     */
    async addCampus(req, res) {
        try {
            const { title, content } = req.body;
            
            // 检查必填字段
            if (hasEmpty(title, content)) {
                return res.send(resMsg(400, "参数错误：标题、内容不能为空"));
            }
            
            // 创建资讯对象
            const campusInfo = {
                title,
                content,
                status: 0, // 默认为草稿状态
                publish_time: new Date()
            };
            
            // 调用模型添加资讯
            const result = await campusModel.addCampus(campusInfo);
            logger.info(`添加资讯成功: ${JSON.stringify(result)}`);
            return res.send(resMsg(200, "添加资讯成功", result));
        } catch (error) {
            logger.error(`添加资讯失败: ${error.message}`);
            return res.send(resMsg(500, "添加资讯失败", error.message));
        }
    }
    
    /**
     * 编辑校园资讯
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     * @returns {Object} - 返回编辑结果
     */
    async editCampus(req, res) {
        try {
            const { id, title, content, status, publish_time } = req.body;
            
            // 检查必填字段
            if (!id) {
                return res.send(resMsg(400, "参数错误：资讯ID不能为空"));
            }
            
            // 创建更新对象
            const updateInfo = {};
            if (title) updateInfo.title = title;
            if (content) updateInfo.content = content;
            if (status !== undefined) updateInfo.status = status;
            if (publish_time) updateInfo.publish_time = publish_time;
            
            // 调用模型更新资讯
            const result = await campusModel.editCampus(updateInfo, id);
            
            if (result[0] === 0) {
                return res.send(resMsg(404, "未找到该资讯或无更新"));
            }
            
            logger.info(`编辑资讯成功: ID=${id}`);
            return res.send(resMsg(200, "编辑资讯成功"));
        } catch (error) {
            logger.error(`编辑资讯失败: ${error.message}`);
            return res.send(resMsg(500, "编辑资讯失败", error.message));
        }
    }
    
    /**
     * 删除校园资讯
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     * @returns {Object} - 返回删除结果
     */
    async deleteCampus(req, res) {
        try {
            const { id } = req.body;
            
            // 检查必填字段
            if (!id) {
                return res.send(resMsg(400, "参数错误：资讯ID不能为空"));
            }
            
            // 调用模型逻辑删除资讯（将状态设为已删除）
            const result = await campusModel.deleteCampus(id);
            
            if (result[0] === 0) {
                return res.send(resMsg(404, "未找到该资讯"));
            }
            
            logger.info(`删除资讯成功: ID=${id}`);
            return res.send(resMsg(200, "删除资讯成功"));
        } catch (error) {
            logger.error(`删除资讯失败: ${error.message}`);
            return res.send(resMsg(500, "删除资讯失败", error.message));
        }
    }
    
    /**
     * 获取校园资讯列表
     * @param {Object} req - 请求对象
     * @param {Object} res - 响应对象
     * @returns {Object} - 返回资讯列表
     */
    async getCampusList(req, res) {
        try {
            // 调用模型获取所有资讯
            const result = await campusModel.getCampusList();
            logger.info(`获取资讯列表成功, 共${result.length}条数据`);
            return res.send(resMsg(200, "获取资讯列表成功", result));
        } catch (error) {
            logger.error(`获取资讯列表失败: ${error.message}`);
            return res.send(resMsg(500, "获取资讯列表失败", error.message));
        }
    }
}

module.exports = new CampusController();