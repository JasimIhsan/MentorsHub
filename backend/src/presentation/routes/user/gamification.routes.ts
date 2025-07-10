import { Router } from "express";
import { getAllListedGamificationTasksController, getUserProgressController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { requireRole } from "../../middlewares/require.role.middleware";

export const gamificationRoute = Router();

gamificationRoute.get("/listed/:userId", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => getAllListedGamificationTasksController.handle(req, res, next));

gamificationRoute.get("/progress/:userId", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => getUserProgressController.handle(req, res, next));
