const Review = require("../models/review.model");
const { catchAsyncErrors, AppError } = require("./error.controller");

exports.createReview = catchAsyncErrors(async function (req, res, next) {
    req.body.user = req.user._id;
    if (req.params.tourId) req.body.tour = req.params.tourId;
    const review = await Review.create(req.body);
    return res.status(201).json({
        status: "success",
        data: { review: review },
    });
});

exports.getTourReviews = catchAsyncErrors(async function (req, res, next) {
    const tourId = req.params.tourId;
    const reviews = await Review.find({ tour: tourId })
        .select("-tour")
        .populate({ path: "user", select: "name photo" });
    return res.status(200).json({
        status: "success",
        reviews: reviews,
    });
});

exports.updateReview = catchAsyncErrors(async function (req, res, next) {
    const loggedInUserId = req.user._id;
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId);

    if (!review) {
        return next(new AppError("Review not found", 400));
    }

    if (!review.user.equals(loggedInUserId)) {
        return next(
            new AppError("Review does not belongs to current user", 403),
        );
    }

    const { rating, review: message } = req.body;
    if (rating) review.rating = rating;
    if (message) review.review = message;

    await review.save({ validateBeforeSave: true });

    return res.status(200).json({
        status: "success",
        review: review,
    });
});

exports.deleteReview = catchAsyncErrors(async function (req, res, next) {
    const loggedInUserId = req.user._id;
    const loggedInUserRole = req.user.role;
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId);

    if (!review) {
        return next(new AppError("Review not found", 400));
    }

    if (loggedInUserRole === "user") {
        if (!review.user.equals(loggedInUserId)) {
            return next(
                new AppError("Review does not belongs to current user", 403),
            );
        }
    }

    await review.deleteOne();

    return res.status(204).json({
        status: "success",
        data: null,
    });
});
