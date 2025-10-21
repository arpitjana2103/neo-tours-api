const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "##-a-tour-must-have-a-name-##"],
            unique: true,
            trim: true,
            maxLength: [40, "##-max-tour-length-be-40-##"],
            minLength: [10, "##-min-tour-length-be-10-##"],
        },
        slug: {
            type: String,
        },
        duration: {
            type: Number,
            required: [true, "##-a-tour-must-have-a-duration-##"],
        },
        maxGroupSize: {
            type: Number,
            required: [true, "##-a-tour-must-have-a-size-##"],
        },
        difficulty: {
            type: String,
            required: [true, "##-a-tour-must-have-a-difficulty-##"],
            enum: {
                values: ["easy", "medium", "difficult"],
                message: [
                    `##-difficulty-enum-values-be-"easy","medium","difficult"-##`,
                ],
            },
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "##-ratingsAverage-must-be-above-or-equels-1.0-##"],
            max: [5, "##-ratingsAverage-must-be-below-or-equels-5.0-##"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "##-a-tour-must-have-a-price-##"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                /* [ Note : 
                Validator runs only on document creation (save/create).
                'this' refers to the current doc for NEW docs only, not for updates.
                */
                validator: function (discount) {
                    return this.price > discount;
                },
                message: ["##-pricediscount-must-be-less-than-price-##"],
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, "##-a-tour-must-have-a-summery-##"],
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
            required: [true, "##-a-tour-must-have-a-cover-image-##"],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            defalut: false,
            select: false,
        },
        startLocation: {
            type: {
                type: String,
                defalut: "Point",
                enum: ["Point"],
            },
            coordinates: [Number],
            address: String,
            description: String,
        },
        locations: [
            {
                type: {
                    type: String,
                    default: "Point",
                    enum: ["Point"],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number,
            },
        ],
        guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    },

    {
        /* [ Note : 
        Enables virtual fields in both JSON and object outputs.
        Ensures computed properties (like fullName) appear when using
        doc.toObject(), JSON.stringify(doc), or res.json(doc).
        Useful for including virtuals in API responses and logs.
        */
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
