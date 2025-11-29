const Tour = require("./../models/tour.model");
const { catchAsyncErrors, AppError } = require("./error.controller");
const QueryFeatures = require("./../utils/queryFeatures.util");

exports.createTour = catchAsyncErrors(async function (req, res, next) {
    /*
    [ Note : 
    Using `Tour.create(req.body)` is a shorthand for `new Tour(req.body).save()`.
    Both run validation and save middleware, but `.save()` allows pre-save modifications.
    Use `.create()` for quick inserts, and `.save()` when you need custom logic before saving.
    
    const doc = new Tour(req.body);
    const newTour = await doc.save();
    */
    const newTour = await Tour.create(req.body);
    return res.status(201).json({
        status: "success",
        data: { tour: newTour },
    });
});

exports.getAllTours = catchAsyncErrors(async function (req, res, next) {
    const mongooseQuery = Tour.find();
    const queryFeatures = new QueryFeatures(mongooseQuery, req.query);
    let query = queryFeatures
        .filter()
        .sort()
        .limitFields()
        .paginate().mongooseQuery;

    if (req.query.populate === "guides") {
        query = query.populate({
            path: "guides",
            select: "name email photo role",
        });
    }

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
    const tour = await Tour.findById(id).populate({
        path: "reviews",
        populate: {
            path: "user",
            select: "name photo",
        },
    });

    if (!tour) {
        return next(new AppError("No tour found with that ID", 404));
    }

    return res.status(200).json({
        status: "success",
        data: { tour: tour },
    });
});

exports.updateTour = catchAsyncErrors(async function (req, res, next) {
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        return next(new AppError(`No tour found with the id: ${id}`, 404));
    }

    return res.status(200).json({
        status: "success",
        data: { tour: tour },
    });
});

exports.deleteTour = catchAsyncErrors(async function (req, res, next) {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    console.log(tour);

    if (!tour) {
        return next(new AppError(`No tour found with the id: ${id}`, 404));
    }

    return res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getTourStats = catchAsyncErrors(async function (req, res, next) {
    const stats = await Tour.aggregate([
        { $match: { ratingsAverage: { $gte: 4.0 } } },
        {
            $group: {
                // _id: null,
                _id: { $toUpper: "$difficulty" },
                numTours: { $sum: 1 },
                numRatings: { $sum: "$ratingsQuantity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
            },
        },
        {
            $sort: {
                avgRating: -1,
            },
        },
    ]);

    return res.status(200).json({
        status: "success",
        data: { stats: stats },
    });
});

exports.getMonthlyPlan = catchAsyncErrors(async function (req, res, next) {
    const { year } = req.params;
    const plan = await Tour.aggregate([
        { $unwind: "$startDates" },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                tourStartsCount: { $sum: 1 },
                tours: { $push: "$name" },
            },
        },
        {
            $addFields: {
                month: "$_id",
            },
        },
        {
            $unset: ["_id"],
        },
        {
            $sort: { tourStartsCount: -1 },
        },
    ]);

    return res.status(200).json({
        status: "success",
        info: 'month "1" represents month "January"',
        data: { plan: plan },
    });
});
