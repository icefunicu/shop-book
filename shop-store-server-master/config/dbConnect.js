const Sequelize = require("sequelize");
const sequelize = new Sequelize("shop", "shop", "123456", {
  host: "8.141.89.85",
  dialect: "mysql",
  operatorsAliases: false,
  dialectOptions: {
    charset: "utf8mb4",
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  timezone: "+08:00"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("\x1B[32m mysql connection successfully\x1B[0m");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = {
  sequelize
};