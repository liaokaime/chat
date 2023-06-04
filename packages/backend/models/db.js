const { Sequelize } = require('sequelize');
const sequelize = new Sequelize("chatdb", "liaokai", "vBa28#O3!v", {
    host: "nas.liaokai.life",
    dialect: "mariadb"
});
module.exports = { sequelize };