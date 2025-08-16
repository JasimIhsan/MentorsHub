import { Router } from "express";
import { getMentorAvailabilityToUserController } from "../../controllers/user/mentor-availability/composer";

export const mentorAvailabilityToUserRouter = Router();

mentorAvailabilityToUserRouter.get("/:mentorId", (req, res, next) => getMentorAvailabilityToUserController.handle(req, res, next));
