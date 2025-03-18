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

  static async deleteMessage(id) {
    return await messageSchema.destroy({ where: { id: id } });
  }

  static async updateMessage({ messageId, content }) {
    return await messageSchema.update({ content }, { where: { id: messageId } });
  }


}

module.exports = MessageModel;
