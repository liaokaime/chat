var express = require('express');
var router = express.Router();
const {ChatRoom} = require('../models');
const authenticateToken = require("../authenticateToken");

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const creatorId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        const chatroom = await ChatRoom.create({ name, creatorId });

        res.status(201).json(chatroom);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Chatroom name already exists.' });
        } else {
            res.status(500).json({ message: 'Something went wrong: ' + error.message });
        }
    }
});


router.get('/', authenticateToken, async (req, res) => {
    try {
        const chatrooms = await ChatRoom.findAll();

        res.json(chatrooms);
    } catch (error) {
        res.status(500).json({message: 'Something went wrong: ' + error.message});
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;

        const chatroom = await ChatRoom.findByPk(id);

        if (!chatroom) {
            return res.status(404).json({message: 'Chatroom not found.'});
        }

        res.json(chatroom);
    } catch (error) {
        res.status(500).json({message: 'Something went wrong: ' + error.message});
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({message: 'Name is required.'});
        }

        const chatroom = await ChatRoom.update({name}, {
            where: {id}
        });

        if (!chatroom[0]) {
            return res.status(404).json({message: 'Chatroom not found.'});
        }

        res.json({message: 'Chatroom updated.'});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong: ' + error.message});
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;

        const chatroom = await ChatRoom.destroy({
            where: {id}
        });

        if (!chatroom) {
            return res.status(404).json({message: 'Chatroom not found.'});
        }

        res.json({message: 'Chatroom deleted.'});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong: ' + error.message});
    }
});

module.exports = router;
