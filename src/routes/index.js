const { Router } = require("express");

const usersRouter = require("./users.routes");
const dishRouter = require("./dish.routes");
const dishIngredientsRouter = require("./dishIngredientsRouter.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/dish", dishRouter);
routes.use("/dishIngredientsRouter", dishIngredientsRouter);

module.exports = routes;