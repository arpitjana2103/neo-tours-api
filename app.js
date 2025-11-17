const express = require("express");
const qs = require("qs");
const tourRouter = require("./routes/tour.route");
const userRouter = require("./routes/user.route");
const {
    globalErrorHandeller,
    AppError,
} = require("./controllers/error.controller");
const { rateLimit } = require("express-rate-limit");
const helper = require("./utils/helper.util");

const app = express();

// req.query parser Middleware
// Set a custom query parser using qs
app.set("query parser", (str) => qs.parse(str));

const limiter = rateLimit({
    windowMs: helper.toMs("1h"),
    limit: 3,
    message: {
        status: "fail",
        message: "Too many requests from this IP, try agail later",
    },
});
app.use("/api", limiter);

// req.body parser Middleware :
// ‍[ note : Parses incoming JSON requests into JavaScript objects ]
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Handellling Unhandled Routes
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handelling Meddleware
app.use(globalErrorHandeller);
module.exports = app;
