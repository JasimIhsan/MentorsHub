import { reviewRepository, userRepository } from "../../../infrastructure/composer";
import { updateUserTaskProgressUseCase } from "../gamification/composer";
import { notifyUserUseCase } from "../notification/composer";
import { CreateReviewUseCase } from "./create.review.usecase";
import { DeleteReviewUseCase } from "./delete.review.usecase";
import { GetMentorReviewsUseCase } from "./get.mentor.review.usecase";
import { UpdateReviewUseCase } from "./update.review.usecasee";

export const createReviewUsecase = new CreateReviewUseCase(reviewRepository, userRepository, updateUserTaskProgressUseCase, notifyUserUseCase);
export const getMentorReviewsUsecase = new GetMentorReviewsUseCase(reviewRepository, userRepository);
export const updateReviewUsecase = new UpdateReviewUseCase(reviewRepository, userRepository, notifyUserUseCase);
export const deleteReviewUsecase = new DeleteReviewUseCase(reviewRepository, userRepository);

