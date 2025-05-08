import { Request, Response, Router } from "express";
import { getAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { getAllApprovedMentorsController, getAllMentorsController, getMentorController, getSessionsRequestsController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { UserModel } from "../../../infrastructure/database/models/user/user.model";
import { getAvailabilityController } from "../../controllers/user/composer";

export const mentorRouter = Router();

// mentorRouter.get("/:mentorId", verifyAccessToken, (req, res) => getMentorController.handle(req, res));

mentorRouter.get('/availability/:mentorId', (req, res) => getAvailabilityController.handle(req, res));
