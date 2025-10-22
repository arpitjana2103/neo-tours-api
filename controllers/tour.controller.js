const Tour = require("./../models/tour.model");
const { catchAsyncErrors } = require("./error.controller");

exports.createTour = catchAsyncErrors(async function (req, res, next) {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
        status: "success",
        data: { tour: newTour },
    });
});

exports.getAllTours = catchAsyncErrors(async function (req, res, next) {
    const tours = await Tour.find();
    return res.status(200).json({
        status: "success",
        count: tours.length,
        data: { tours: tours },
    });
});
