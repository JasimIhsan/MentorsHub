import { Router } from "express";
import { fetchAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { fetchAllApprovedMentorsController, fetchAllMentorsController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { UserModel } from "../../../infrastructure/database/models/user/user.model";

export const mentorRouter = Router();

mentorRouter.get("/all", verifyAccessToken, (req, res) => fetchAllMentorsController.handle(req, res));

mentorRouter.get("/approved", async (req, res) => fetchAllApprovedMentorsController.handle(req, res));
