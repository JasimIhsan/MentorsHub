import { NextFunction, Request, Response } from "express";
import { IGetDocumentByKeyUseCase } from "../../../application/interfaces/usecases/documents";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";

export interface CustomRequest extends Request {
   user: UserEntity | AdminEntity;
}

export class GetDocumentByKeyController {
   constructor(private readonly getDocumentByKeyUseCase: IGetDocumentByKeyUseCase) {}
   async handle(req: Request, res: Response, next: NextFunction) {
      try {
         const customReq = req as CustomRequest;
         const mentorId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
         const user = customReq.user;
         const documentKeyParam = req.query.documentKey;
         const documentKey = Array.isArray(documentKeyParam) ? documentKeyParam[0] : documentKeyParam;

         const document = await this.getDocumentByKeyUseCase.execute({ mentorId, user, documentKey: documentKey as string });

         // Redirect to S3 URL, user won’t see it in frontend code
         // res.redirect(document);
         res.status(HttpStatusCode.OK).json({ success: true, document });
      } catch (error) {
         next(error);
      }
   }
}
