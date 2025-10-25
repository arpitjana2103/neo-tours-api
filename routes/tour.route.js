const express = require("express");
const tourController = require("./../controllers/tour.controller");

const tourRouter = express.Router();

tourRouter
    .route("/")
    .post(tourController.createTour)
    .get(tourController.getAllTours);

tourRouter
    .route("/top-5-cheap")
    .get(tourController.aliasTop5Cheap, tourController.getAllTours);

tourRouter.route("/:id").get(tourController.getTour);

module.exports = tourRouter;
