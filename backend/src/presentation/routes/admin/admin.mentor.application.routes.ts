import { Router } from "express";
import { verifyMentorApplicationController } from "../../controllers/admin/composer";

export const mentorApplicationRouter = Router();

mentorApplicationRouter.put("/:userId/verify", (req, res) => verifyMentorApplicationController.handle(req, res));
