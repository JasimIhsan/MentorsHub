import { reviewRepository, userRepository } from "../../../infrastructure/composer";
import { CreateReviewUseCase } from "./create.review.usecase";
import { GetMentorReviewsUseCase } from "./get.mentor.review.usecase";

export const createReviewUsecase = new CreateReviewUseCase(reviewRepository, userRepository);
export const getMentorReviewsUsecase = new GetMentorReviewsUseCase(reviewRepository);