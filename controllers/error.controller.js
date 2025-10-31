exports.AppError = class extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);

        /*
        Error.captureStackTrace(this, this.constructor) : Explanation
        -------------------------------------------------------------
        this → refers to the current instance of your AppError.
        this.constructor → refers to the AppError class itself.

        This tells JavaScript:
        "Start the stack trace from this point, and exclude everything above this constructor."
        */
    }
};

exports.catchAsyncErrors = function (asyncFunc) {
    return function (req, res, next) {
        asyncFunc(req, res, next).catch(function (err) {
            console.log("[Caught Async Error]", err);
            return next(err);
        });
    };
};

exports.globalErrorHandeller = function (err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        return sendErrForDev(err, res);
    }

    if (process.env.NODE_ENV === "production") {
        return sendErrForProd(err, res);
    }
};

/////////////////////////////////////////////////
//// Helper Functions for Error Handelling //////

function sendErrForDev(err, res) {
    if (err.name === "CastError") err.statusCode = 400;
    if (err.code === 11000) err.statusCode = 400;
    if (err.name === "ValidationError") err.statusCode = 400;
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
}

function sendErrForProd(err, res) {
    // Handle DB Cast Error
    // Exmple : Search for Invalid ID
    err = handleCastErrorDB(err);

    // Handle Duplicate Field Value Error
    // Exmple : Repeating field value for unique field
    err = handleDuplicateFieldsDB(err);

    // Handle Validation Error
    // Exmple : Fail schema validation
    err = handleValidationError(err);

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    // Unknown Error Handelling in Production
    return res.status(500).json({
        status: "error",
        message: "Something went very wrong !",
    });
}

function handleCastErrorDB(err) {
    if (err.name === "CastError") {
        const message = `[Invalid] ${err.path}: "${err.value}" is not a valid value.`;
        return new exports.AppError(message, 400);
    }
}

function handleDuplicateFieldsDB(err) {
    if (err.code === 11000) {
        const message = `[Duplicate field value] ${JSON.stringify(
            err.keyValue
        )}`;
        return new exports.AppError(message, 400);
    }
    return err;
}

function handleValidationError(err) {
    if (err.name === "ValidationError") {
        const { message } = err;
        return new exports.AppError(message, 400);
    }
    return err;
}
