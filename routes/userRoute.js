const router = require("express").Router();
const UserController = require("../controllers/userController")


// user

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.post("/updatePassword", UserController.updatePassword);

router.get("/getPulse", UserController.getPulse);

router.get("/getLocation", UserController.getLocation);

module.exports = router;