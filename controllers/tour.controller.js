const Tour = require("./../models/tour.model");
const { catchAsyncErrors, AppError } = require("./error.controller");
const QueryFeatures = require("./../utils/QueryFeatures");

exports.createTour = catchAsyncErrors(async function (req, res, next) {
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
        status: "success",
        data: { tour: newTour },
    });
});

exports.getAllTours = catchAsyncErrors(async function (req, res, next) {
    const mongooseQuery = Tour.find();
    const queryFeatures = new QueryFeatures(mongooseQuery, req.query);
    const query = queryFeatures
        .filter()
        .sort()
        .limitFields()
        .paginate().mongooseQuery;

    const tours = await query;

    return res.status(200).json({
        status: "success",
        count: tours.length,
        data: { tours: tours },
    });
});

exports.aliasTop5Cheap = catchAsyncErrors(async function (req, res, next) {
    req.query = Object.assign(req.query, {
        limit: "5",
        sort: "price,-ratingsAverage",
        fields: "name,price,ratingsAverage,summery,difficulty,duration",
    });
    next();
});

exports.getTour = catchAsyncErrors(async function (req, res, next) {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    if (!tour) {
        return next(new AppError("No tour found with that ID", 404));
    }

    return res.status(200).json({
        status: "success",
        data: { tour: tour },
    });
});
