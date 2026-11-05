import * as budgetService from "../services/budget.service.js";

export async function createBudgetHandler(req, res, next) {
    try {
        const userId = req.userId;
        const budget = await budgetService.createBudget(userId, req.body);

        return res.status(201).json({
            success: true,
            data: budget,
            message: "Budget created successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function listBudgetsHandler(req, res, next) {
    try {
        const userId = req.userId;
        const budgets = await budgetService.listBudgets(userId, req.query);

        return res.status(200).json({
            success: true,
            data: budgets,
            message: "Budgets retrieved successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function updateBudgetHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const updated = await budgetService.updateBudget(userId, id, req.body);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Budget updated successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteBudgetHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const deleted = await budgetService.deleteBudget(userId, id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: { id: deleted._id },
            message: "Budget deleted successfully",
        });
    } catch (err) {
        next(err);
    }
}

