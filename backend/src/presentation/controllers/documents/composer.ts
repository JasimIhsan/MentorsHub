import { getDocumentByKeyUseCase, getDocumentsUseCase } from "../../../application/usecases/documents/composer";
import { s3BucketService } from "../../../infrastructure/composer";
import { DownloadDocumentsController } from "./download.documents.controller";
import { GetDocumentByKeyController } from "./get.document.by.key.controller";
import { GetDocumentsController } from "./get.documents.controller";

export const getDocumentsController = new GetDocumentsController(getDocumentsUseCase);
export const downloadDocumentController = new DownloadDocumentsController(s3BucketService);
export const getDocumentByKeyController = new GetDocumentByKeyController(getDocumentByKeyUseCase);
