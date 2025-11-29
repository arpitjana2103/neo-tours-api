const express = require("express");
const tourController = require("./../controllers/tour.controller");
const authController = require("./../controllers/auth.controller");
const reviewRouter = require("./review.route");
const tourRouter = express.Router();

// tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter
    .route("/")
    .post(
        authController.authProtect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.createTour,
    )
    .get(tourController.getAllTours);

tourRouter
    .route("/top-5-cheap")
    .get(tourController.aliasTop5Cheap, tourController.getAllTours);

tourRouter.route("/tour-stats").get(tourController.getTourStats);
tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
    .route("/:id")
    .get(tourController.getTour)
    .patch(
        authController.authProtect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.updateTour,
    )
    .delete(
        authController.authProtect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour,
    );

module.exports = tourRouter;
