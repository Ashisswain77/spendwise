import { z } from "zod";
import { textOnlyDescriptionSchema } from "../middleware/validate.js";
import { objectIdSchema, positiveIntegerPaiseSchema } from "./transaction.validator.js";

export const createGoalSchema = z.object({
    body: z.object({
        name: textOnlyDescriptionSchema,
        targetAmountInPaise: positiveIntegerPaiseSchema,
        amountSavedInPaise: z
            .number({ invalid_type_error: "Amount saved must be a number" })
            .int("Amount saved must be an integer in paise")
            .min(0, "Amount saved cannot be negative")
            .optional()
            .default(0),
        targetDate: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid targetDate format",
            })
            .transform((val) => new Date(val))
            .optional()
            .nullable(),
    }),
});

export const updateGoalSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z
        .object({
            name: textOnlyDescriptionSchema.optional(),
            targetAmountInPaise: positiveIntegerPaiseSchema.optional(),
            amountSavedInPaise: z
                .number({ invalid_type_error: "Amount saved must be a number" })
                .int("Amount saved must be an integer in paise")
                .min(0, "Amount saved cannot be negative")
                .optional(),
            targetDate: z
                .string()
                .refine((val) => !isNaN(Date.parse(val)), {
                    message: "Invalid targetDate format",
                })
                .transform((val) => new Date(val))
                .optional()
                .nullable(),
            status: z
                .enum(["active", "completed"], {
                    errorMap: () => ({ message: "Status must be either 'active' or 'completed'" }),
                })
                .optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided to update",
        }),
});

export const goalParamSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});

export const listGoalsQuerySchema = z.object({
    query: z.object({
        status: z.enum(["active", "completed", "all"]).optional().default("all"),
    }),
});

export const addGoalContributionSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        amountInPaise: positiveIntegerPaiseSchema,
        date: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), {
                message: "Invalid date format",
            })
            .transform((val) => new Date(val))
            .optional(),
    }),
});

