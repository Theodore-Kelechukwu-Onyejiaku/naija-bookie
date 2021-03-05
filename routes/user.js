var express = require('express');
var userRouter = express.Router();
var userController = require("../controllers/user");
var chatController = require("../controllers/chat/chatController");
var verification = require("../middlewares/validation/validateToken");



userRouter.get("/signup", userController.getSignup);
userRouter.post("/signup", userController.singnup);

userRouter.get("/signin", userController.getSignIn);
userRouter.post("/signin", userController.signin);

// userRouter.get("/forgotPassword", userController.getForgotPasswordPage);
userRouter.get("/logout", userController.logout);

userRouter.get("/:id",verification.verifyIfLoggedIn, userController.getDetail);

userRouter.post("/:id/update", verification.verifyUser, userController.updateUser)

userRouter.get("/:id/chat", verification.verifyUser, chatController.getChats);

module.exports = userRouter;