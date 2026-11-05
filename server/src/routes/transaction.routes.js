import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import {
    createTransactionSchema,
    updateTransactionSchema,
    getTransactionByIdSchema,
    listTransactionsQuerySchema,
} from "../validators/transaction.validator.js";
import {
    createTransactionHandler,
    listTransactionsHandler,
    getTransactionByIdHandler,
    updateTransactionHandler,
    deleteTransactionHandler,
} from "../controllers/transaction.controller.js";

const router = Router();

// Protect all transaction routes with requireAuth
router.use(requireAuth);

router.get("/", validate(listTransactionsQuerySchema), listTransactionsHandler);
router.post("/", validate(createTransactionSchema), createTransactionHandler);
router.get("/:id", validate(getTransactionByIdSchema), getTransactionByIdHandler);
router.patch("/:id", validate(updateTransactionSchema), updateTransactionHandler);
router.delete("/:id", validate(getTransactionByIdSchema), deleteTransactionHandler);

export default router;

