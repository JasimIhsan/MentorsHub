import { Router } from "express";
import { fetchAllMentorsController, fetchMentorController, fetchSessionsRequestsController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const mentorSessionRouter = Router();

mentorSessionRouter.get("/:mentorId/requests", async (req, res) => fetchSessionsRequestsController.handle(req, res));
