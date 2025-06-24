import { Router } from "express";
import { createReviewController, deleteReviewController, getMentorReviewsController, updateReviewController } from "../../controllers/review-rating/composer";
export const reviewRouter = Router();

reviewRouter.post("/create", (req, res, next) => createReviewController.handle(req, res, next));

reviewRouter.get("/:mentorId", (req, res, next) => getMentorReviewsController.handle(req, res, next));

reviewRouter.put("/:reviewId", (req, res, next) => updateReviewController.handle(req, res, next));

reviewRouter.delete("/:reviewId/:mentorId", (req, res, next) => deleteReviewController.handle(req, res, next));
