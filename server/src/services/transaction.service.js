import Transaction from "../models/Transaction.js";

export async function createTransaction(userId, data) {
    const transaction = new Transaction({
        ...data,
        userId,
    });
    return await transaction.save();
}

export async function getTransactionById(userId, id) {
    return await Transaction.findOne({ _id: id, userId });
}

export async function updateTransaction(userId, id, updates) {
    return await Transaction.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { returnDocument: "after", runValidators: true }
    );
}

export async function deleteTransaction(userId, id) {
    return await Transaction.findOneAndDelete({ _id: id, userId });
}

export async function listTransactions(userId, queryOptions = {}) {
    const filter = { userId };

    if (queryOptions.type) {
        filter.type = queryOptions.type;
    }

    if (queryOptions.category) {
        filter.category = queryOptions.category;
    }

    if (queryOptions.wallet) {
        filter.wallet = queryOptions.wallet;
    }

    if (queryOptions.search) {
        const searchRegex = new RegExp(escapeRegex(queryOptions.search), "i");
        filter.$or = [{ title: searchRegex }, { note: searchRegex }];
    }

    if (queryOptions.startDate || queryOptions.endDate) {
        filter.date = {};
        if (queryOptions.startDate) {
            filter.date.$gte = new Date(queryOptions.startDate);
        }
        if (queryOptions.endDate) {
            filter.date.$lte = new Date(queryOptions.endDate);
        }
    }

    const allowedSortFields = ["date", "amountInPaise", "createdAt", "title"];
    const sortBy = allowedSortFields.includes(queryOptions.sortBy) ? queryOptions.sortBy : "date";
    const sortOrder = queryOptions.sortOrder === "asc" || queryOptions.sortOrder === "1" ? 1 : -1;

    const page = Math.max(1, parseInt(queryOptions.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(queryOptions.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
        Transaction.find(filter)
            .sort({ [sortBy]: sortOrder, _id: -1 })
            .skip(skip)
            .limit(limit),
        Transaction.countDocuments(filter),
    ]);

    return {
        transactions,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
