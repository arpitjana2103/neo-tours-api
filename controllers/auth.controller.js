const User = require("./../models/user.model");
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
    const token = signToken({ id: user._id });
    return res.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user: user,
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
