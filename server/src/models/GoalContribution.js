import mongoose from "mongoose";

const goalContributionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "userId is required"],
            index: true,
            trim: true,
        },
        goalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Goal",
            required: [true, "goalId is required"],
            index: true,
        },
        amountInPaise: {
            type: Number,
            required: [true, "amountInPaise is required"],
            validate: {
                validator: (val) => Number.isInteger(val) && val > 0,
                message: "amountInPaise must be a positive integer",
            },
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

goalContributionSchema.index({ userId: 1, goalId: 1, createdAt: -1 });

const GoalContribution = mongoose.model("GoalContribution", goalContributionSchema);

export default GoalContribution;

