const express = require("express");
const authController = require("./../controllers/auth.controller");
const userController = require("./../controllers/user.controller");
const userRouter = express.Router();

userRouter
    .route("/")
    .get(
        authController.authProtect,
        authController.restrictTo("admin"),
        userController.getAllUsers,
    );

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);

userRouter.route("/forgot-password").post(authController.forgotPassword);
userRouter.route("/reset-password/:token").patch(authController.resetPassword);
userRouter
    .route("/update-password")
    .patch(authController.authProtect, authController.updatePassword);

userRouter
    .route("/update-me")
    .patch(authController.authProtect, userController.updateMe);

userRouter
    .route("/delete-me")
    .delete(authController.authProtect, userController.deleteMe);

module.exports = userRouter;
