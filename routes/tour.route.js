const express = require("express");
const tourController = require("./../controllers/tour.controller");
const authController = require("./../controllers/auth.controller");
const tourRouter = express.Router();

tourRouter
    .route("/")
    .post(tourController.createTour)
    .get(authController.authProtect, tourController.getAllTours);

tourRouter
    .route("/top-5-cheap")
    .get(tourController.aliasTop5Cheap, tourController.getAllTours);

tourRouter.route("/tour-stats").get(tourController.getTourStats);
tourRouter.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

tourRouter
    .route("/:id")
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(
        authController.authProtect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour,
    );

module.exports = tourRouter;
