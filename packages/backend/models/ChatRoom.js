const { DataTypes, Model } = require('sequelize');
const {sequelize} = require("./db");
class ChatRoom extends Model {}

ChatRoom.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate : DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'ChatRoom',
    tableName: 'Chatroom',
    timestamps: false,
});
module.exports = { ChatRoom };