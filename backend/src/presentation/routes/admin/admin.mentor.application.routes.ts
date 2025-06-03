import { Router } from "express";
import { verifyMentorApplicationController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { getAllMentorsController } from "../../controllers/mentors/composer";
import { io } from "../../../server";
import { requireRole } from "../../middlewares/require.role.middleware";

export const mentorApplicationRouter = Router();

mentorApplicationRouter.get("/all", verifyAccessToken, requireRole("admin"), (req, res) => getAllMentorsController.handle(req, res));

mentorApplicationRouter.put("/:userId/verify", verifyAccessToken, requireRole("admin"), (req, res) => {
	const controller = verifyMentorApplicationController(io);
	controller.handle(req, res);
});
