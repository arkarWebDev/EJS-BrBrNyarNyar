const Sequelize = require("sequelize");

const sequelize = new Sequelize("blog", "root", "abcd", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
