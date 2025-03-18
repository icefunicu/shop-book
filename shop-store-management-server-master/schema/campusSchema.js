const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define("campus", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '资讯ID'
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
            comment: '资讯标题'
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: '资讯内容'
        },
        status: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0,
            comment: '状态：0-草稿 1-已发布 2-已删除'
        },
        publish_time: {
            type: DataTypes.DATE,
            field: 'publish_time',
            comment: '发布时间'
        },
        author_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'author_id',
            comment: '发布人ID'
        },
        create_time: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue("create_time")).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        update_time: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue("update_time")).format("YYYY-MM-DD HH:mm:ss");
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });
};
