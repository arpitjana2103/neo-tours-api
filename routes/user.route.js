const express = require("express");
const authController = require("./../controllers/auth.controller");
const userRouter = express.Router();

userRouter.route("/signup").post(authController.signup);
userRouter.route("/login").post(authController.login);

userRouter.route("/forgot-password").post(authController.forgotPassword);

module.exports = userRouter;
