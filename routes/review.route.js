const express = require("express");
const authController = require("./../controllers/auth.controller");
const reviewController = require("./../controllers/review.controller");

const reviewRouter = express.Router();

reviewRouter
    .route("/")
    .post(authController.authProtect, reviewController.createReview);

module.exports = reviewRouter;
