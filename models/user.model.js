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
            message: "##-please-provide-a-valid-email-##",
        },
    },
    photo: String,
    password: {
        type: String,
        required: [true, "##-please-provide-a-password-##"],
        minlength: 8,
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

const User = mongoose.model("User", userSchema);

module.exports = User;
