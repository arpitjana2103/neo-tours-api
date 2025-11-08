const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "##-please-tell-us-your-name!-##"],
    },
    email: {
        type: String,
        required: [true, "##-please-provide-your-email-##"],
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: ["##-please-provide-a-valid-email-##"],
        },
    },
    photo: String,
    password: {
        type: String,
        required: [true, "##-please-provide-a-password-##"],
        minlength: 8,
    },
    passwordConfirmed: {
        type: String,
        required: [true, "##-please-confirm-your-passwrod-##"],
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
