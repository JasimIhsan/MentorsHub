import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { fetchAllApprovedMentorsController, fetchMentorController } from "../../controllers/mentors/composer";
export const userSideMentorRouter = Router();

userSideMentorRouter.get("/approved", verifyAccessToken, (req, res) => fetchAllApprovedMentorsController.handle(req, res));

userSideMentorRouter.get("/:mentorId", verifyAccessToken, (req, res) => fetchMentorController.handle(req, res));
