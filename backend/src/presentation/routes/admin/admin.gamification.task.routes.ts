import { Router } from "express";
import { actionTypeController, createGamificationTaskController, getAllGamificationTasksController, updateGamificationTaskStatusController } from "../../controllers/admin/gamification/composer";

export const adminGamificationTaskRouter = Router();

adminGamificationTaskRouter.post("/create-action-type", (req, res, next) => actionTypeController.create(req, res, next));

adminGamificationTaskRouter.get("/action-types", (req, res, next) => actionTypeController.getAll(req, res, next));

adminGamificationTaskRouter.post("/create-task", (req, res, next) => createGamificationTaskController.handle(req, res, next));

adminGamificationTaskRouter.get("/", (req, res, next) => getAllGamificationTasksController.handle(req, res, next));

adminGamificationTaskRouter.patch("/tasks/:taskId/toggle-list", (req, res, next) => updateGamificationTaskStatusController.handle(req, res, next));
