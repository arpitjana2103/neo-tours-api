const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    password: {
        type: String,
        required: [true, "##-User-Must-Have-A-Password-##"],
        // Will not work while update..
        // Only work while creating new Docs..
        validate: {
            validator: validatePassword,
            message:
                "##-Password-Must-Be-5-To-20-Characters-And-Include-Uppercase,Lowercase-&-Number-##",
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

// runs after Model.prototype.save() and Model.create()
userSchema.post("save", function (doc, next) {
    doc.password = undefined;
    doc.active = undefined;
    doc.__v = undefined;
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
