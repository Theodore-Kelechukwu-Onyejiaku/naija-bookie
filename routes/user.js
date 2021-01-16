var express = require('express');
var userRouter = express.Router();
var userController = require("../controllers/user");



userRouter.get("/signup", userController.getSignup);
userRouter.post("/signup", userController.singnup);

userRouter.get("/signin", userController.getSignIn);
userRouter.post("/signin", userController.signin);

userRouter.get("/logout", userController.logout);


module.exports = userRouter;