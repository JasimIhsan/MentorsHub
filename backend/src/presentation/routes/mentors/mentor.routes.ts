import { Request, Response, Router } from "express";
import { fetchAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { fetchAllApprovedMentorsController, fetchAllMentorsController, fetchMentorController, fetchSessionsRequestsController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { UserModel } from "../../../infrastructure/database/models/user/user.model";

export const mentorRouter = Router();

mentorRouter.get("/all", verifyAccessToken, (req, res) => fetchAllMentorsController.handle(req, res));

mentorRouter.get("/approved", verifyAccessToken, (req, res) => fetchAllApprovedMentorsController.handle(req, res));

mentorRouter.get("/:mentorId", verifyAccessToken, (req, res) => fetchMentorController.handle(req, res));

mentorRouter.get("/:mentorId/requests", async (req, res) => fetchSessionsRequestsController.handle(req, res));
