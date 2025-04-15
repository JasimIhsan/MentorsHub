import { Router } from "express";
import { fetchAllMentorsUsecase } from "../../../application/usecases/mentors/composer";
import { fetchAllMentorsController } from "../../controllers/mentors/composer";

export const mentorRouter = Router();

mentorRouter.get("/all", (req, res) => fetchAllMentorsController.handle(req, res));
