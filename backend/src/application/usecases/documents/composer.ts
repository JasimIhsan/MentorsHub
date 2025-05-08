import { mentorRepository, s3BucketService } from "../../../infrastructure/composer";
import { GetDocumentsUseCase } from "./get.documents.usecase";
import { UploadMentorDocumentUseCase } from "./upload.mentor.document.usecase";

export const uploadMentorDocumentUseCase = new UploadMentorDocumentUseCase(s3BucketService);
export const getDocumentsUseCase = new GetDocumentsUseCase(mentorRepository, s3BucketService);
