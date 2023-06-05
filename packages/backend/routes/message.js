var express = require('express');
var router = express.Router();
const { Message, ChatRoom } = require('../models');
const authenticateToken = require("../authenticateToken");
const { Op } = require('sequelize');

router.post('/chatrooms/:id/messages', authenticateToken, async (req, res) => {
    try {
        const chatroomId = req.params.id;
        const { content } = req.body;

        const chatroom = await ChatRoom.findByPk(chatroomId);

        if (!chatroom) {
            return res.status(404).json({ message: 'Chatroom not found.' });
        }

        const message = await Message.create({
            userId: req.user.id,
            chatroomId,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
});

router.get('/chatrooms/:id/messages', authenticateToken, async (req, res) => {
    try {
        const chatroomId = req.params.id;

        const messages = await Message.findAll({
            where: { chatroomId }
        });

        res.json(messages);
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

        if (message.userId !== req.user.id) {
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
                chatroomId: id,
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
