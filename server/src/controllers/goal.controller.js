import * as goalService from "../services/goal.service.js";

export async function createGoalHandler(req, res, next) {
    try {
        const userId = req.userId;
        const goal = await goalService.createGoal(userId, req.body);

        return res.status(201).json({
            success: true,
            data: goal,
            message: "Savings goal created successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function listGoalsHandler(req, res, next) {
    try {
        const userId = req.userId;
        const goals = await goalService.listGoals(userId, req.query);

        return res.status(200).json({
            success: true,
            data: goals,
            message: "Savings goals retrieved successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function getGoalByIdHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const goal = await goalService.getGoalById(userId, id);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: goal,
            message: "Savings goal retrieved successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function updateGoalHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const updated = await goalService.updateGoal(userId, id, req.body);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Savings goal updated successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteGoalHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const deleted = await goalService.deleteGoal(userId, id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: { id: deleted._id },
            message: "Savings goal deleted successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function addGoalContributionHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const result = await goalService.addGoalContribution(userId, id, req.body);

        return res.status(201).json({
            success: true,
            data: result,
            message: "Goal contribution added successfully",
        });
    } catch (err) {
        next(err);
    }
}

