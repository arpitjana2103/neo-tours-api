const express = require("express");
const qs = require("qs");
const tourRouter = require("./routes/tour.route");
const { globalErrorHandeller } = require("./controllers/error.controller");

const app = express();

// req.query parser Middleware
// Set a custom query parser using qs
app.set("query parser", (str) => qs.parse(str));

// req.body parser Middleware :
// ‍[ note : Parses incoming JSON requests into JavaScript objects ]
app.use(express.json());

app.use("/api/v1/tours", tourRouter);

// Handellling Unhandled Routes
app.all("*", function (req, res, next) {
    return next(
        new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
    );
});

// Global Error Handelling Meddleware
app.use(globalErrorHandeller);
module.exports = app;
