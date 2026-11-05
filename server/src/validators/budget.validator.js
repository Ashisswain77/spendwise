import { z } from "zod";
import { objectIdSchema, positiveIntegerPaiseSchema } from "./transaction.validator.js";

const periodRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

export const createBudgetSchema = z.object({
    body: z.object({
        category: z
            .string({ required_error: "Category is required" })
            .trim()
            .min(1, "Category cannot be empty")
            .max(100, "Category cannot exceed 100 characters"),
        limitInPaise: positiveIntegerPaiseSchema,
        period: z
            .string({ required_error: "Period is required" })
            .trim()
            .regex(periodRegex, "Period must be in YYYY-MM format (e.g. 2026-11)"),
    }),
});

export const updateBudgetSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z
        .object({
            category: z
                .string()
                .trim()
                .min(1, "Category cannot be empty")
                .max(100, "Category cannot exceed 100 characters")
                .optional(),
            limitInPaise: positiveIntegerPaiseSchema.optional(),
            period: z
                .string()
                .trim()
                .regex(periodRegex, "Period must be in YYYY-MM format (e.g. 2026-11)")
                .optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided to update",
        }),
});

export const budgetParamSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});

export const listBudgetsQuerySchema = z.object({
    query: z.object({
        period: z
            .string()
            .trim()
            .regex(periodRegex, "Period must be in YYYY-MM format (e.g. 2026-11)")
            .optional(),
    }),
});

