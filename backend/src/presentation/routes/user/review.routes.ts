import { Router } from "express";
import { createReviewController, getMentorReviewsController, updateReviewController } from "../../controllers/review-rating/composer";
export const reviewRouter = Router();

reviewRouter.post("/create", (req, res) => createReviewController.handle(req, res));

reviewRouter.get("/:mentorId", (req, res) => getMentorReviewsController.handle(req, res));

reviewRouter.put("/edit-review/:reviewId", (req, res) => updateReviewController.handle(req, res));