const { Sequelize } = require("sequelize");
const path = require("path");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_PATH || path.join(__dirname, "../database.sqlite"),
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

module.exports = {
  sequelize,
};
