const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/user.model");
const { AppError } = require("../controllers/error.controller");
const { catchAsyncErrors } = require("./error.controller");

const signToken = function (payLoad) {
    const jwtSecretKey = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(payLoad, jwtSecretKey, {
        expiresIn: jwtExpiresIn,
    });
    return token;
};

const signAndSendToken = function (user, statusCode, res) {
    return res.status(statusCode).json({
        status: "success",
        token: signToken({ _id: user._id }),
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        },
    });
};

exports.signup = catchAsyncErrors(async function (req, res, next) {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    signAndSendToken(user, 201, res);
});

exports.login = catchAsyncErrors(async function (req, res, next) {
    const { email, password } = req.body;

    // [1] Check If Email and Password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password!", 400));
    }

    // [2] Check if User exists and Passwrod is correct
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.verifyPassword(password, user.password))) {
        return next(new AppError("Incorrect Email or Password", 401));
    }

    // [3] If everything ok, send Token to client
    signAndSendToken(user, 200, res);
});

exports.authProtect = catchAsyncErrors(async function (req, res, next) {
    // [1] Getting the Token
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
        token = token.split(" ")[1];
    }
    if (!token) {
        return next(new AppError("Please login to get access.", 401));
    }

    // [2] Verify token
    const jwtSecretKey = process.env.JWT_SECRET;
    const decoded = await promisify(jwt.verify)(token, jwtSecretKey);

    // [3] Check if user still exists
    // Ex. What if user has been deleated in the mean-time and someone-else is
    // is trying to access stealing the token
    const user = await User.findById(decoded._id);
    if (!user) {
        return next(new AppError("The User donot exist.", 401));
    }

    // [4] Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(AppError("Password changed! Please log in again!", 401));
    }

    req.user = user;

    next();
});

exports.restrictTo = function (...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403,
                ),
            );
        }
        next();
    };
};
