import { Router } from "express";
import { createReviewController, getMentorReviewsController } from "../../controllers/review-rating/composer";
export const reviewRouter = Router();

reviewRouter.post("/create", (req, res) => createReviewController.handle(req, res));

reviewRouter.get("/:mentorId", (req, res) => getMentorReviewsController.handle(req, res));
