const express = require("express");
const tourRouter = require("./routes/tour.route");
const { globalErrorHandeller } = require("./controllers/error.controller");

const app = express();

// req.body parser Middleware :
// ‍[ note : Parses incoming JSON requests into JavaScript objects ]
app.use(express.json());

app.use("/api/v1/tours", tourRouter);

// Global Error Handelling Meddleware
app.use(globalErrorHandeller);
module.exports = app;
