const { Router } = require("express");
const dishRoutes = Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const DishController = require("../controllers/DishController");
const dishController = new DishController();

dishRoutes.use(ensureAuthenticated);

dishRoutes.post("/", dishController.create);
dishRoutes.get("/:id", dishController.show);
dishRoutes.delete("/:id", dishController.delete);
dishRoutes.put("/:id", dishController.update);
dishRoutes.get("/", dishController.index);

module.exports = dishRoutes;
