import { Router } from "express";
import { createReviewController, deleteReviewController, getMentorReviewsController, updateReviewController } from "../../controllers/review-rating/composer";
export const reviewRouter = Router();

reviewRouter.post("/create", (req, res) => createReviewController.handle(req, res));

reviewRouter.get("/:mentorId", (req, res) => getMentorReviewsController.handle(req, res));

reviewRouter.put("/:reviewId", (req, res) => updateReviewController.handle(req, res));

reviewRouter.delete("/:reviewId/:mentorId", (req, res) => deleteReviewController.handle(req, res));
