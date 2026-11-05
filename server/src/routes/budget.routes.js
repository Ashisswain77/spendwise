import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import {
    createBudgetSchema,
    updateBudgetSchema,
    budgetParamSchema,
    listBudgetsQuerySchema,
} from "../validators/budget.validator.js";
import {
    createBudgetHandler,
    listBudgetsHandler,
    updateBudgetHandler,
    deleteBudgetHandler,
} from "../controllers/budget.controller.js";

const router = Router();

// Protect all budget routes with requireAuth
router.use(requireAuth);

router.get("/", validate(listBudgetsQuerySchema), listBudgetsHandler);
router.post("/", validate(createBudgetSchema), createBudgetHandler);
router.patch("/:id", validate(updateBudgetSchema), updateBudgetHandler);
router.delete("/:id", validate(budgetParamSchema), deleteBudgetHandler);

export default router;

