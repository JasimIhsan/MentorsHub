import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { getAllApprovedMentorsController, getMentorController } from "../../controllers/mentors/composer";
import { requireRole } from "../../middlewares/require.role.middleware";
export const userSideMentorRouter = Router();

userSideMentorRouter.get("/approved", verifyAccessToken, requireRole("mentor", "user"), (req, res) => getAllApprovedMentorsController.handle(req, res));

userSideMentorRouter.get("/:mentorId", verifyAccessToken, requireRole("mentor", "user"), (req, res) => getMentorController.handle(req, res));
