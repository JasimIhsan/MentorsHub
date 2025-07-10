import { Router } from "express";
import {
	actionTypeController,
	createGamificationTaskController,
	deleteGamificationTaskController,
	editGamificationTaskController,
	getAllGamificationTasksController,
	updateGamificationTaskStatusController,
} from "../../controllers/admin/gamification/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const adminGamificationTaskRouter = Router();

adminGamificationTaskRouter.post("/create-action-type", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => actionTypeController.create(req, res, next));

adminGamificationTaskRouter.get("/action-types", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => actionTypeController.getAll(req, res, next));

adminGamificationTaskRouter.post("/create-task", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => createGamificationTaskController.handle(req, res, next));

adminGamificationTaskRouter.get("/", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getAllGamificationTasksController.handle(req, res, next));

adminGamificationTaskRouter.patch("/tasks/:taskId/toggle-list", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => updateGamificationTaskStatusController.handle(req, res, next));

adminGamificationTaskRouter.delete("/tasks/:taskId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => deleteGamificationTaskController.handle(req, res, next));

adminGamificationTaskRouter.put("/tasks/:taskId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => editGamificationTaskController.handle(req, res, next));
