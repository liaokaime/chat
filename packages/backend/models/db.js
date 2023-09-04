const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("chatdb", "liaokai", "vBa28#O3!v", {
    host: "192.168.31.219",
    dialect: "mariadb"
});
module.exports = { sequelize };