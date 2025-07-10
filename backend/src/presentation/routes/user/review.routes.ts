import { Router } from "express";
import { createReviewController, deleteReviewController, getMentorReviewsController, updateReviewController } from "../../controllers/review-rating/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
export const reviewRouter = Router();

reviewRouter.post("/create", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => createReviewController.handle(req, res, next));

reviewRouter.get("/:mentorId", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => getMentorReviewsController.handle(req, res, next));

reviewRouter.put("/:reviewId", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => updateReviewController.handle(req, res, next));

reviewRouter.delete("/:reviewId/:mentorId", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => deleteReviewController.handle(req, res, next));
