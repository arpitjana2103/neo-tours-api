const express = require("express");
const authController = require("./../controllers/auth.controller");
const userRouter = express.Router();

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);

userRouter.route("/forgot-password").post(authController.forgotPassword);
userRouter.route("/reset-password/:token").patch(authController.resetPassword);
userRouter
    .route("/update-password")
    .patch(authController.authProtect, authController.updatePassword);
module.exports = userRouter;
