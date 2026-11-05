import { z } from "zod";
import { textOnlyDescriptionSchema } from "../middleware/validate.js";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z
    .string({ required_error: "ID parameter is required" })
    .regex(objectIdRegex, "Invalid ID format: must be a 24-character hex string");

export const positiveIntegerPaiseSchema = z
    .number({
        required_error: "Amount in paise is required",
        invalid_type_error: "Amount in paise must be a number",
    })
    .int("Amount in paise must be an integer")
    .positive("Amount in paise must be a positive integer greater than 0");

export const createTransactionSchema = z.object({
    body: z.object({
        title: textOnlyDescriptionSchema,
        amountInPaise: positiveIntegerPaiseSchema,
        type: z.enum(["income", "expense"], {
            errorMap: () => ({ message: "Type must be either 'income' or 'expense'" }),
        }),
        category: z
            .string({ required_error: "Category is required" })
            .trim()
            .min(1, "Category cannot be empty")
            .max(100, "Category cannot exceed 100 characters"),
        note: z.string().trim().max(1000, "Note cannot exceed 1000 characters").optional().default(""),
        wallet: z.string().trim().max(100, "Wallet cannot exceed 100 characters").optional().default("Cash"),
        mode: z.string().trim().max(100).optional(),
        date: z
            .string({ required_error: "Date is required" })
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format: must be a valid date string",
            })
            .transform((val) => new Date(val)),
    }).transform((data) => {
        // If mode is passed from frontend, map to wallet if wallet wasn't explicitly set
        if (data.mode && (!data.wallet || data.wallet === "Cash")) {
            data.wallet = data.mode;
        }
        delete data.mode;
        return data;
    }),
});

export const updateTransactionSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z
        .object({
            title: textOnlyDescriptionSchema.optional(),
            amountInPaise: positiveIntegerPaiseSchema.optional(),
            type: z
                .enum(["income", "expense"], {
                    errorMap: () => ({ message: "Type must be either 'income' or 'expense'" }),
                })
                .optional(),
            category: z
                .string()
                .trim()
                .min(1, "Category cannot be empty")
                .max(100, "Category cannot exceed 100 characters")
                .optional(),
            note: z.string().trim().max(1000, "Note cannot exceed 1000 characters").optional(),
            wallet: z.string().trim().max(100, "Wallet cannot exceed 100 characters").optional(),
            mode: z.string().trim().max(100).optional(),
            date: z
                .string()
                .refine((val) => !isNaN(Date.parse(val)), {
                    message: "Invalid date format: must be a valid date string",
                })
                .transform((val) => new Date(val))
                .optional(),
        })
        .transform((data) => {
            if (data.mode && !data.wallet) {
                data.wallet = data.mode;
            }
            delete data.mode;
            return data;
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided to update",
        }),
});

export const getTransactionByIdSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});

export const listTransactionsQuerySchema = z.object({
    query: z.object({
        type: z.enum(["income", "expense"]).optional(),
        category: z.string().trim().optional(),
        wallet: z.string().trim().optional(),
        search: z.string().trim().optional(),
        startDate: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid startDate format",
            })
            .optional(),
        endDate: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid endDate format",
            })
            .optional(),
        sortBy: z
            .enum(["date", "amountInPaise", "createdAt", "title"], {
                errorMap: () => ({ message: "sortBy must be one of: date, amountInPaise, createdAt, title" }),
            })
            .optional()
            .default("date"),
        sortOrder: z
            .enum(["asc", "desc", "1", "-1"], {
                errorMap: () => ({ message: "sortOrder must be one of: asc, desc, 1, -1" }),
            })
            .optional()
            .default("desc"),
        page: z.coerce
            .number({ invalid_type_error: "page must be a number" })
            .int("page must be an integer")
            .min(1, "page must be at least 1")
            .optional()
            .default(1),
        limit: z.coerce
            .number({ invalid_type_error: "limit must be a number" })
            .int("limit must be an integer")
            .min(1, "limit must be at least 1")
            .max(100, "limit cannot exceed 100")
            .optional()
            .default(20),
    }),
});

