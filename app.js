const express = require("express");
const tourRouter = require("./routes/tour.route");

const app = express();

// req.body parser Middleware :
// ‍[ note : Parses incoming JSON requests into JavaScript objects ]
app.use(express.json());

app.use("/api/v1/tours", tourRouter);

module.exports = app;
