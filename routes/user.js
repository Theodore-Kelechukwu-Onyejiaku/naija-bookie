var express = require('express');
var userRouter = express.Router();
var userController = require("../controllers/user");
var verification = require("../middlewares/validation/validateToken");



userRouter.get("/signup", userController.getSignup);
userRouter.post("/signup", userController.singnup);

userRouter.get("/signin", userController.getSignIn);
userRouter.post("/signin", userController.signin);

userRouter.get("/logout", userController.logout);

userRouter.get("/:id",verification.verifyIfLoggedIn, userController.getDetail);


module.exports = userRouter;