import mongoose from "mongoose";
import Goal from "../models/Goal.js";
import GoalContribution from "../models/GoalContribution.js";

export async function createGoal(userId, data) {
    const status = (data.amountSavedInPaise || 0) >= data.targetAmountInPaise ? "completed" : "active";
    const goal = new Goal({
        ...data,
        status,
        userId,
    });
    return await goal.save();
}

export async function getGoalById(userId, id) {
    const goal = await Goal.findOne({ _id: id, userId });
    if (!goal) return null;

    const contributions = await GoalContribution.find({ goalId: id, userId }).sort({ date: -1, createdAt: -1 });

    return {
        ...goal.toObject(),
        contributions,
    };
}

export async function updateGoal(userId, id, updates) {
    const current = await Goal.findOne({ _id: id, userId });
    if (!current) return null;

    const targetAmount = updates.targetAmountInPaise ?? current.targetAmountInPaise;
    const amountSaved = updates.amountSavedInPaise ?? current.amountSavedInPaise;

    if (amountSaved > targetAmount) {
        const error = new Error(`Amount saved (${amountSaved} paise) cannot exceed target amount (${targetAmount} paise).`);
        error.statusCode = 400;
        throw error;
    }

    // Auto-update status based on amount saved if not explicitly specified
    if (!updates.status) {
        updates.status = amountSaved >= targetAmount ? "completed" : "active";
    }

    return await Goal.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { returnDocument: "after", runValidators: true }
    );
}

export async function deleteGoal(userId, id) {
    const goal = await Goal.findOneAndDelete({ _id: id, userId });
    if (goal) {
        // Cascade cleanup contributions
        await GoalContribution.deleteMany({ goalId: id, userId });
    }
    return goal;
}

export async function listGoals(userId, queryOptions = {}) {
    const filter = { userId };
    if (queryOptions.status && queryOptions.status !== "all") {
        filter.status = queryOptions.status;
    }

    return await Goal.find(filter).sort({ createdAt: -1 });
}

export async function addGoalContribution(userId, goalId, data) {
    const goal = await Goal.findOne({ _id: goalId, userId });

    if (!goal) {
        const error = new Error("Goal not found");
        error.statusCode = 404;
        throw error;
    }

    if (goal.status === "completed") {
        const error = new Error("Goal is already completed. No further contributions allowed.");
        error.statusCode = 400;
        throw error;
    }

    const remainingInPaise = goal.targetAmountInPaise - goal.amountSavedInPaise;
    if (data.amountInPaise > remainingInPaise) {
        const error = new Error(
            `Contribution amount (${data.amountInPaise} paise) exceeds the remaining target (${remainingInPaise} paise).`
        );
        error.statusCode = 400;
        throw error;
    }

    const newSavedInPaise = goal.amountSavedInPaise + data.amountInPaise;
    const isCompleted = newSavedInPaise >= goal.targetAmountInPaise;

    // Use session transaction if replica set supports it
    let session = null;
    try {
        session = await mongoose.startSession();
    } catch {
        session = null;
    }

    const isReplicaSet = session && mongoose.connection?.client?.topology?.description?.type !== "Single";

    if (isReplicaSet) {
        try {
            session.startTransaction();

            goal.amountSavedInPaise = newSavedInPaise;
            if (isCompleted) {
                goal.status = "completed";
            }
            await goal.save({ session });

            const contribution = new GoalContribution({
                userId,
                goalId: goal._id,
                amountInPaise: data.amountInPaise,
                date: data.date || new Date(),
            });
            await contribution.save({ session });

            await session.commitTransaction();
            return { goal, contribution };
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
        }
    } else {
        if (session) {
            await session.endSession();
        }

        goal.amountSavedInPaise = newSavedInPaise;
        if (isCompleted) {
            goal.status = "completed";
        }
        await goal.save();

        const contribution = new GoalContribution({
            userId,
            goalId: goal._id,
            amountInPaise: data.amountInPaise,
            date: data.date || new Date(),
        });
        await contribution.save();

        return { goal, contribution };
    }
}
