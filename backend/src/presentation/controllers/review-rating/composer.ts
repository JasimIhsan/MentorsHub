import { createReviewUsecase, getMentorReviewsUsecase } from "../../../application/usecases/review-rating/composer";
import { CreateReviewController } from "./create.review.controller";
import { GetMentorReviewsController } from "./get.mentor.review.controller";

export const createReviewController = new CreateReviewController(createReviewUsecase);
export const getMentorReviewsController = new GetMentorReviewsController(getMentorReviewsUsecase);
