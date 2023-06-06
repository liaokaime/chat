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
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // 'User' refers to the table name
            key: 'id',
        },
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
    tableName: 'ChatRoom',
    timestamps: false,
});
module.exports = { ChatRoom };