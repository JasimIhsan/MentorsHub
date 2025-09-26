import { Request, Response, NextFunction } from 'express';
import { IGetSessionRescheduleRequestsByMentorUseCase } from '../../../application/interfaces/usecases/reschedule.request';
import { RescheduleStatusEnum } from '../../../application/interfaces/enums/reschedule.status.enum';
import { HttpStatusCode } from '../../../shared/constants/http.status.codes';
import { logger } from '../../../infrastructure/utils/logger';

export class GetRescheduleRequestsByMentorController {
   constructor(private readonly getSessionRescheduleRequestsByMentorUseCase: IGetSessionRescheduleRequestsByMentorUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const mentorId = req.params.mentorId;
         const { page, limit, status } = req.query;

         const requests = await this.getSessionRescheduleRequestsByMentorUseCase.execute(mentorId, {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            status: status as RescheduleStatusEnum,
         });
         res.status(HttpStatusCode.OK).json({ success: true, requests: requests.sessions, total: requests.total });
      } catch (error) {
         console.error(`❌❌❌ Error in GetRescheduleRequestsByMentorController: ${error}`);
         logger.error(`❌ Error in GetRescheduleRequestsByMentorController: ${error}`);
         next(error);
      }
   }
}
