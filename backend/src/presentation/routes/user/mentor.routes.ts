import { Request, Response, Router } from "express";
import { getAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { getAllApprovedMentorsController, getAllMentorsController, getMentorController, getSessionsRequestsController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { UserModel } from "../../../infrastructure/database/models/user/user.model";
import { getAvailabilityController } from "../../controllers/user/composer";
import { requireRole } from "../../middlewares/require.role.middleware";

export const mentorRouter = Router();

mentorRouter.get("/:mentorId", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => getMentorController.handle(req, res, next));

mentorRouter.get("/availability/:mentorId", verifyAccessToken, requireRole("mentor", "user"), (req, res, next) => getAvailabilityController.handle(req, res, next));
