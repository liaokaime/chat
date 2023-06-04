var express = require('express');
var router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("../constants");
const authenticateToken = require("../authenticateToken");

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 检查用户名和密码是否存在
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'username, password, and email are required.' });
    }

    // 检查用户名是否已被使用
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'username already exists.' });
    }

    // 创建新用户
    const user = await User.create({ username, password, email });

    // 返回新创建的用户
    res.status(201).json(user);
  } catch (error) {
    // 如果出错，返回错误信息
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户名和密码是否存在
    if (!username || !password) {
      return res.status(400).json({ message: 'username and password are required.' });
    }

    // 检查用户名是否存在
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'username does not exist.' });
    }

    // 检查密码是否正确
    if (user.password !== password) {
      return res.status(400).json({ message: 'password is incorrect.' });
    }

    // 创建JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    // 将JWT存入cookie
    res.cookie('token', token, { httpOnly: true });

    // 登录成功，返回用户信息
    res.status(200).json(user);
  } catch (error) {
    // 如果出错，返回错误信息
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 获取用户信息
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 返回用户信息
    res.status(200).json(user);
  } catch (error) {
    // 如果出错，返回错误信息
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
});


router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 仅允许用户更新自己的信息
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'You can only update your own profile.' });
    }

    const user = await User.update(req.body, {
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // 仅允许用户删除自己的信息
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'You can only delete your own profile.' });
    }

    const user = await User.destroy({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong: ' + error.message });
  }
});

module.exports = router;
