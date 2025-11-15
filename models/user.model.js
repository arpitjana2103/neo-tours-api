const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const helper = require("./../utils/helper.util");

const validatePassword = function (password) {
    return (
        password.length >= 5 &&
        password.length <= 20 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );
};

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
            message: "##-please-provide-a-valid-email-##",
        },
    },
    photo: String,
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "##-User-Must-Have-A-Password-##"],
        // Will not work while update..
        // Only work while creating new Docs..
        validate: {
            validator: validatePassword,
            message:
                "##-password-must-be-5-to-20-characters-and-include-uppercase,lowercase-&-number-##",
        },
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "##-please-confirm-your-passwrod-##"],
        validate: {
            /* [ Note : 
                Validator runs only on document creation (save/create), not for updates.
                'this' refers to the current doc for NEW docs only.
            */
            validator: function (passwordConfirm) {
                return this.password === passwordConfirm;
            },
            message: "##-password-and-passwordConfirm-need-to-be-same-##",
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
});

////////////////////////////////////////
// DOCUMENT MEDDLEWARE / HOOK //////////

// runs before Model.prototype.save() and Model.create()
userSchema.pre("save", async function (next) {
    // Only run the Function if the password has been changes
    // For Ex. ( if user is changing the email, no need to hash the password in that case)
    if (!this.isModified("password")) return next();

    // Hash Password
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// runs after Model.prototype.save() and Model.create()
userSchema.post("save", function (doc, next) {
    doc.password = undefined;
    doc.active = undefined;
    doc.__v = undefined;
    next();
});

////////////////////////////////////////
// Instance Method /////////////////////
// These Methods will be availabe for all the Documents

userSchema.methods.verifyPassword = async function (rawPass, hashedPass) {
    return await bcrypt.compare(rawPass, hashedPass);
};

userSchema.methods.varifyToken = async function (rawToken, hashedToken) {
    return await bcrypt.compare(rawToken, hashedToken);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );
        return JWTTimestamp < changedTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const fourDigitNum = helper.getRandomNum(1000, 9999);
    const fourAlphaStr = helper.getRandomAlphabets(4);
    const token = `${fourDigitNum}-${fourAlphaStr}`;
    return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
