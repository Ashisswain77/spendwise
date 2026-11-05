import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "userId is required"],
            index: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, "name is required"],
            trim: true,
            minlength: [1, "name cannot be empty"],
            maxlength: [150, "name cannot exceed 150 characters"],
        },
        targetAmountInPaise: {
            type: Number,
            required: [true, "targetAmountInPaise is required"],
            validate: {
                validator: (val) => Number.isInteger(val) && val > 0,
                message: "targetAmountInPaise must be a positive integer",
            },
        },
        amountSavedInPaise: {
            type: Number,
            default: 0,
            validate: {
                validator: (val) => Number.isInteger(val) && val >= 0,
                message: "amountSavedInPaise must be a non-negative integer",
            },
        },
        targetDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: {
                values: ["active", "completed"],
                message: "status must be either 'active' or 'completed'",
            },
            default: "active",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, createdAt: -1 });

const Goal = mongoose.model("Goal", goalSchema);

export default Goal;

