import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "userId is required"],
            index: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, "title is required"],
            trim: true,
            minlength: [1, "title cannot be empty"],
            maxlength: [200, "title cannot exceed 200 characters"],
        },
        amountInPaise: {
            type: Number,
            required: [true, "amountInPaise is required"],
            validate: {
                validator: (val) => Number.isInteger(val) && val > 0,
                message: "amountInPaise must be a positive integer",
            },
        },
        type: {
            type: String,
            required: [true, "type is required"],
            enum: {
                values: ["income", "expense"],
                message: "type must be either 'income' or 'expense'",
            },
        },
        category: {
            type: String,
            required: [true, "category is required"],
            trim: true,
        },
        note: {
            type: String,
            trim: true,
            default: "",
            maxlength: [1000, "note cannot exceed 1000 characters"],
        },
        wallet: {
            type: String,
            trim: true,
            default: "Cash",
        },
        date: {
            type: Date,
            required: [true, "date is required"],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound indexes for performant querying and filtering
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, wallet: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;

