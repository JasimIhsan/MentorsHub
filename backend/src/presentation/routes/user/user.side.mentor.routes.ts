import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { getAllApprovedMentorsController, getMentorController } from "../../controllers/mentors/composer";
export const userSideMentorRouter = Router();

userSideMentorRouter.get("/approved", verifyAccessToken, (req, res) => getAllApprovedMentorsController.handle(req, res));

userSideMentorRouter.get("/:mentorId", verifyAccessToken, (req, res) => getMentorController.handle(req, res));
