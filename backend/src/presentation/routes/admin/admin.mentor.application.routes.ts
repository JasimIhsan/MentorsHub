import { Router } from "express";
import { verifyMentorApplicationController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { getAllMentorsController } from "../../controllers/mentors/composer";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const mentorApplicationRouter = Router();

mentorApplicationRouter.get("/all", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getAllMentorsController.handle(req, res, next));

mentorApplicationRouter.put("/:userId/verify", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => verifyMentorApplicationController.handle(req, res, next));

