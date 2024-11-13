const express = require("express");
const session = require("express-session");
const { keycloak, memoryStore } = require("./middlewares/keycloakMiddleware");
const authRoutes = require("./routes/authRoutes");
const eurekaService = require("./services/eurekaService");
const app = express();
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);
app.use(keycloak.middleware());
app.use(express.json());
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
eurekaService.start();
