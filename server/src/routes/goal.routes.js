import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { validate } from "../middleware/validate.js";
import {
    createGoalSchema,
    updateGoalSchema,
    goalParamSchema,
    listGoalsQuerySchema,
    addGoalContributionSchema,
} from "../validators/goal.validator.js";
import {
    createGoalHandler,
    listGoalsHandler,
    getGoalByIdHandler,
    updateGoalHandler,
    deleteGoalHandler,
    addGoalContributionHandler,
} from "../controllers/goal.controller.js";

const router = Router();

// Protect all goal routes with requireAuth
router.use(requireAuth);

router.get("/", validate(listGoalsQuerySchema), listGoalsHandler);
router.post("/", validate(createGoalSchema), createGoalHandler);
router.get("/:id", validate(goalParamSchema), getGoalByIdHandler);
router.patch("/:id", validate(updateGoalSchema), updateGoalHandler);
router.delete("/:id", validate(goalParamSchema), deleteGoalHandler);
router.post("/:id/contributions", validate(addGoalContributionSchema), addGoalContributionHandler);

export default router;

