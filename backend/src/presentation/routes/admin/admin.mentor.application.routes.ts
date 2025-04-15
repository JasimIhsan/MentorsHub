import { Router } from "express";
import { verifyMentorApplicationController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const mentorApplicationRouter = Router();

mentorApplicationRouter.put("/:userId/verify", verifyAccessToken, (req, res) => verifyMentorApplicationController.handle(req, res));
