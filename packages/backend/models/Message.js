const { DataTypes, Model } = require('sequelize');
const {sequelize} = require("./db");
const { User } = require('./User');
const { ChatRoom } = require('./ChatRoom');
class Message extends Model {}

Message.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    chatroom_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Message',
    tableName: 'Message',
    timestamps: false,
});

// 设置外键关系
Message.belongsTo(User, { foreignKey: 'user_id' });
Message.belongsTo(ChatRoom, { foreignKey: 'chatroom_id' });
module.exports = { Message };