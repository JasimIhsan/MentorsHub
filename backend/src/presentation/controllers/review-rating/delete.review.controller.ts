import { NextFunction, Request, Response } from "express";
import { IDeleteReviewUseCase } from "../../../application/interfaces/usecases/review";
import { logger } from "../../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export class DeleteReviewController {
   constructor(private deleteReviewUseCase: IDeleteReviewUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const reviewId = Array.isArray(req.params.reviewId) ? req.params.reviewId[0] : req.params.reviewId;
         const { mentorId, userId } = req.query;
         await this.deleteReviewUseCase.execute(reviewId, mentorId as string, userId as string);
         res.status(HttpStatusCode.OK).json({ success: true, message: "Review deleted successfully" });
      } catch (error) {
         logger.error(`❌ Error in DeleteReviewController: ${error}`);
         next(error);
      }
   }
}
