const express = require("express");
const authController = require("./../controllers/auth.controller");
const reviewController = require("./../controllers/review.controller");

// const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
    .route("/")
    .post(
        authController.authProtect,
        authController.restrictTo("user"),
        reviewController.createReview,
    );

reviewRouter
    .route("/:tourId")
    .get(authController.authProtect, reviewController.getTourReviews);

module.exports = reviewRouter;
