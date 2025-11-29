const express = require("express");
const authController = require("./../controllers/auth.controller");
const userController = require("./../controllers/user.controller");
const userRouter = express.Router();

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);
userRouter.route("/forgot-password").post(authController.forgotPassword);
userRouter.route("/reset-password/:token").patch(authController.resetPassword);

userRouter.use(authController.authProtect);

userRouter
    .route("/")
    .get(authController.restrictTo("admin"), userController.getAllUsers);

userRouter.route("/update-password").patch(authController.updatePassword);
userRouter.route("/update-me").patch(userController.updateMe);
userRouter.route("/delete-me").delete(userController.deleteMe);
userRouter.route("/me").get(userController.getMe);

module.exports = userRouter;
