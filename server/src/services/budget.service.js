import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

export async function createBudget(userId, data) {
    const existing = await Budget.findOne({
        userId,
        category: data.category,
        period: data.period,
    });

    if (existing) {
        const error = new Error(`A budget for category '${data.category}' in period '${data.period}' already exists.`);
        error.statusCode = 409;
        throw error;
    }

    const budget = new Budget({
        ...data,
        userId,
    });
    return await budget.save();
}

export async function getBudgetById(userId, id) {
    return await Budget.findOne({ _id: id, userId });
}

export async function updateBudget(userId, id, updates) {
    // If category or period are being updated, ensure no duplicate
    if (updates.category || updates.period) {
        const current = await Budget.findOne({ _id: id, userId });
        if (!current) return null;

        const targetCategory = updates.category || current.category;
        const targetPeriod = updates.period || current.period;

        const conflict = await Budget.findOne({
            _id: { $ne: id },
            userId,
            category: targetCategory,
            period: targetPeriod,
        });

        if (conflict) {
            const error = new Error(`A budget for category '${targetCategory}' in period '${targetPeriod}' already exists.`);
            error.statusCode = 409;
            throw error;
        }
    }

    return await Budget.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { returnDocument: "after", runValidators: true }
    );
}

export async function deleteBudget(userId, id) {
    return await Budget.findOneAndDelete({ _id: id, userId });
}

export async function listBudgets(userId, queryOptions = {}) {
    const filter = { userId };
    if (queryOptions.period) {
        filter.period = queryOptions.period;
    }

    const budgets = await Budget.find(filter).sort({ period: -1, category: 1 });

    // Calculate actual spending for each budget within its respective period
    const budgetsWithSpending = await Promise.all(
        budgets.map(async (budgetDoc) => {
            const budget = budgetDoc.toObject();
            const [year, month] = budget.period.split("-").map(Number);
            const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
            const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

            const txFilter = {
                userId,
                type: "expense",
                date: { $gte: startDate, $lt: endDate },
            };

            // If not Overall, restrict to specific category
            if (budget.category !== "Overall") {
                txFilter.category = budget.category;
            }

            const result = await Transaction.aggregate([
                { $match: txFilter },
                { $group: { _id: null, totalSpent: { $sum: "$amountInPaise" } } },
            ]);

            const spentInPaise = result[0]?.totalSpent || 0;
            const remainingInPaise = Math.max(0, budget.limitInPaise - spentInPaise);
            const percentageUsed = budget.limitInPaise > 0
                ? Math.min(100, Math.round((spentInPaise / budget.limitInPaise) * 100))
                : 0;

            return {
                ...budget,
                spentInPaise,
                remainingInPaise,
                percentageUsed,
                isOverBudget: spentInPaise > budget.limitInPaise,
            };
        })
    );

    return budgetsWithSpending;
}