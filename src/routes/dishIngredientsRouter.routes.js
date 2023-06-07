const { Router } = require("express");
const dishIngredientsRouterRoutesRoutes = Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const DishIngredientsController = require("../controllers/DishIngredientsController");
const dishIngredientsRouterRoutesController = new DishIngredientsController();

dishIngredientsRouterRoutesRoutes.get("/", ensureAuthenticated, dishIngredientsRouterRoutesController.index);

module.exports = dishIngredientsRouterRoutesRoutes;