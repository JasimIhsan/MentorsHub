import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { getAllApprovedMentorsController, getMentorController } from "../../controllers/mentors/composer";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/role";
export const userSideMentorRouter = Router();

userSideMentorRouter.get("/approved/:userId", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => getAllApprovedMentorsController.handle(req, res, next));

userSideMentorRouter.get("/:mentorId", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => getMentorController.handle(req, res, next));
