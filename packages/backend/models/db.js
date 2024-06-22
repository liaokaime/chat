const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("chatdb", "username", "password", {
    host: "127.0.0.1",
    dialect: "mariadb"
});
module.exports = { sequelize };

