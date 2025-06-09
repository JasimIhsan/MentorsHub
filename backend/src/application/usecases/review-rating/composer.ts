import { reviewRepository, userRepository } from "../../../infrastructure/composer";
import { CreateReviewUseCase } from "./create.review.usecase";
import { GetMentorReviewsUseCase } from "./get.mentor.review.usecase";
import { UpdateReviewUseCase } from "./update.review.usecasee";

export const createReviewUsecase = new CreateReviewUseCase(reviewRepository, userRepository);
export const getMentorReviewsUsecase = new GetMentorReviewsUseCase(reviewRepository);
export const updateReviewUsecase = new UpdateReviewUseCase(reviewRepository, userRepository);