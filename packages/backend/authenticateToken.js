const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require("./constants");

function authenticateToken(req, res, next) {
    // console.log(req, "res=======")
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }

        // 将解码后的用户信息添加到请求对象中
        req.user = decoded;

        // 调用 next() 函数，将请求传递给下一个中间件或路由处理函数
        next();
    });
}

module.exports = authenticateToken;