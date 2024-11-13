const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("keycloak", "keycloak_user", "1234", {
  host: "localhost",
  dialect: "postgres",
});


sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Error connecting to database:", err));


sequelize
  .sync({ alter: true }) 
  .then(() => console.log("Tables synced with the database."))
  .catch((err) => console.error("Error syncing tables:", err));

module.exports = sequelize;
