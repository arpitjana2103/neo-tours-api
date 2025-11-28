const Review = require("../models/review.model");
const { catchAsyncErrors } = require("./error.controller");

exports.createReview = catchAsyncErrors(async function (req, res, next) {
    req.body.user = req.user._id;
    const review = await Review.create(req.body);
    return res.status(201).json({
        status: "success",
        data: { review: review },
    });
});
