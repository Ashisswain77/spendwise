import * as transactionService from "../services/transaction.service.js";

export async function createTransactionHandler(req, res, next) {
    try {
        const userId = req.userId;
        const transaction = await transactionService.createTransaction(userId, req.body);

        return res.status(201).json({
            success: true,
            data: transaction,
            message: "Transaction created successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function listTransactionsHandler(req, res, next) {
    try {
        const userId = req.userId;
        const result = await transactionService.listTransactions(userId, req.query);

        return res.status(200).json({
            success: true,
            data: result.transactions,
            pagination: result.pagination,
            message: "Transactions retrieved successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function getTransactionByIdHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const transaction = await transactionService.getTransactionById(userId, id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: transaction,
            message: "Transaction retrieved successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function updateTransactionHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const updated = await transactionService.updateTransaction(userId, id, req.body);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: updated,
            message: "Transaction updated successfully",
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteTransactionHandler(req, res, next) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const deleted = await transactionService.deleteTransaction(userId, id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: { id: deleted._id },
            message: "Transaction deleted successfully",
        });
    } catch (err) {
        next(err);
    }
}

