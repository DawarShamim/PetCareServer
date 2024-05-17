const router = require("express").Router();
const UserController = require("../controllers/userController");
const { Authentication } = require("../Auth");

// user

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.post("/updatePassword", Authentication, UserController.updatePassword);

router.put("/", Authentication, UserController.updateProfile);

router.post("/attachDevice", Authentication, UserController.attachDevice);

module.exports = router;