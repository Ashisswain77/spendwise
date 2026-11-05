import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "userId is required"],
            index: true,
            trim: true,
        },
        category: {
            type: String,
            required: [true, "category is required"],
            trim: true,
        },
        limitInPaise: {
            type: Number,
            required: [true, "limitInPaise is required"],
            validate: {
                validator: (val) => Number.isInteger(val) && val > 0,
                message: "limitInPaise must be a positive integer",
            },
        },
        period: {
            type: String,
            required: [true, "period is required in YYYY-MM format"],
            trim: true,
            match: [/^\d{4}-(0[1-9]|1[0-2])$/, "period must be in YYYY-MM format"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound unique index on userId, category, and period to prevent duplicate budgets
budgetSchema.index({ userId: 1, category: 1, period: 1 }, { unique: true });
budgetSchema.index({ userId: 1, period: 1 });

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;

