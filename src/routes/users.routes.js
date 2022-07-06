const { Router, response } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const usersRoutes = Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const UsersController = require("../controllers/UsersController");
const usersController = new UsersController();

const UsersAvatarController = require("../controllers/UsersAvatarController");
const usersAvatarController = new UsersAvatarController();

const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), usersAvatarController.update);

module.exports = usersRoutes;