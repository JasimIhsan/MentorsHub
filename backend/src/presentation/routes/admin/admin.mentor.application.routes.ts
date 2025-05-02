import { Router } from "express";
import { verifyMentorApplicationController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { getAllMentorsController } from "../../controllers/mentors/composer";

export const mentorApplicationRouter = Router();

mentorApplicationRouter.get("/all", verifyAccessToken, (req, res) => getAllMentorsController.handle(req, res));

mentorApplicationRouter.put("/:userId/verify", verifyAccessToken, (req, res) => verifyMentorApplicationController.handle(req, res));
