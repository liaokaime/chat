var express = require('express');
var router = express.Router();
const { Message, ChatRoom } = require('../models');
const authenticateToken = require("../authenticateToken");
const { Op } = require('sequelize');
const {User} = require("../models/User");

router.post('/chatrooms/:id/messages', authenticateToken, async (req, res) => {
    try {
        const chatroom_id = req.params.id;
        const { content } = req.body;

        const chatroom = await ChatRoom.findByPk(chatroom_id);

        if (!chatroom) {
            return res.status(404).json({ message: 'Chatroom not found.' });
        }

        const message = await Message.create({
            user_id: req.user.id,
            chatroom_id,
            content
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
});

router.get('/chatrooms/:id/messages', authenticateToken, async (req, res) => {
    try {
        const chatroom_id = req.params.id;
        const user_id = req.user.id; // 获取当前用户的ID

        const messages = await Message.findAll({
            where: { chatroom_id },
            include: [
                {
                    model: User,
                    attributes: ['username'], // 获取发送者的用户名
                }
            ]
        });

        // 添加 'isMine' 字段来判断消息是否由当前用户发送
        const messagesWithSender = messages.map(message => {
            const isMine = message.user_id === user_id;
            return { ...message.get(), isMine, senderName: message.User.username };
        });

        res.json(messagesWithSender);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
});

router.delete('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // 仅允许用户删除自己的消息
        const message = await Message.findOne({ where: { id } });

        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        if (message.user_id !== req.user.id) {
            return res.status(403).json({ message: 'You can only delete your own messages.' });
        }

        await message.destroy();

        res.json({ message: 'Message deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
});

router.get('/chatrooms/:id/messages/after/:timestamp', async (req, res) => {
    try {
        const { id, timestamp } = req.params;

        if (!timestamp) {
            return res.status(400).json({ message: 'Timestamp is required.' });
        }

        // Sequelize 使用的是 UTC 时间，因此需要将时间戳转换为 Date 对象
        const lastUpdate = new Date(parseInt(timestamp));

        const messages = await Message.findAll({
            where: {
                chatroom_id: id,
                createdAt: {
                    // 使用 Sequelize 的 Op.gte 操作符来获取在指定时间之后创建的所有消息
                    [Op.gte]: lastUpdate
                }
            }
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
});


module.exports = router;
