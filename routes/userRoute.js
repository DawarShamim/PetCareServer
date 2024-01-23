const router = require("express").Router();
const UserController = require("../controllers/userController");
const { Authentication } = require("../Auth");

// user

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.post("/updatePassword", Authentication, UserController.updatePassword);

router.get("/getPulse", Authentication, UserController.getPulse);

router.get("/getLocation", Authentication, UserController.getLocation);

module.exports = router;