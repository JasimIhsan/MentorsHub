import { createReviewUsecase, deleteReviewUsecase, getMentorReviewsUsecase, updateReviewUsecase } from "../../../application/usecases/review-rating/composer";
import { CreateReviewController } from "./create.review.controller";
import { DeleteReviewController } from "./delete.review.controller";
import { GetMentorReviewsController } from "./get.mentor.review.controller";
import { UpdateReviewController } from "./update.review.controller";

export const createReviewController = new CreateReviewController(createReviewUsecase);
export const getMentorReviewsController = new GetMentorReviewsController(getMentorReviewsUsecase);
export const updateReviewController = new UpdateReviewController(updateReviewUsecase);
export const deleteReviewController = new DeleteReviewController(deleteReviewUsecase);
