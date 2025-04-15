import { Router } from "express";
import { fetchAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { fetchAllMentorsController } from "../../controllers/mentors/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const mentorRouter = Router();

mentorRouter.get("/all", verifyAccessToken, (req, res) => fetchAllMentorsController.handle(req, res));
