const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const messageSchema = sequelize.import("../schema/messageSchema");

class MessageModel {

  static async getMessages() {
    return await messageSchema.findAll();
  }

  static async addMessage({ name, message }) {
    return await messageSchema.create({ name: name, content: message });
  }

  static async deleteMessage(messageId) {
    return await messageSchema.destroy({ where: { id: messageId } });
  }

  static async updateMessage({ messageId, content }) {
    return await messageSchema.update({ content }, { where: { id: messageId } });
  }


}

module.exports = MessageModel;
