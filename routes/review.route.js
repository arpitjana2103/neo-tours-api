const express = require("express");
const authController = require("./../controllers/auth.controller");
const reviewController = require("./../controllers/review.controller");

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authController.authProtect);
reviewRouter
    .route("/")
    .post(authController.restrictTo("user"), reviewController.createReview);

reviewRouter.route("/:tourId").get(reviewController.getTourReviews);

reviewRouter
    .route("/:reviewId")
    .patch(authController.restrictTo("user"), reviewController.updateReview)
    .delete(
        authController.restrictTo("user", "admin"),
        reviewController.deleteReview,
    );

module.exports = reviewRouter;
