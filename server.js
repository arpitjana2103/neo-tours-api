const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// Handlling Uncaught Exceptions [ Synchronous errors ]
process.on("uncaughtException", function (err) {
    console.log("UNCAUGHT EXCEPTION :: SHUTTING DOWN THE SERVER");
    console.log(err);
    process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DBLOC = process.env.DATABASE_LOCAL;
const PORT = process.env.PORT || 6700;

const server = app.listen(PORT, function () {
    console.log("⌛ connecting to database...");

    mongoose
        .connect(DBLOC)
        .then(function () {
            console.log("✅ database connecting successfull");
            console.log(`🔗 api url : http://127.0.0.1:${PORT}`);
        })
        .catch(function (err) {
            console.log("(ノಠ益ಠノ) Database Connection Failed.");
            console.log(err);
        });
});

// Handlling Unhandled Promise Rejections
process.on("unhandledRejection", function (err) {
    console.log("UNHUNDELED REJECTION :: SHUTTING DOWN THE SERVER");
    console.log(err);
    // Shutting down gracefully.
    server.close(function () {
        process.exit(1);
    });
});
