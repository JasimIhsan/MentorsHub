import { getDocumentsUseCase } from "../../../application/usecases/documents/composer";
import { GetDocumentsController } from "./get.documents.controller";

export const getDocumentsController = new GetDocumentsController(getDocumentsUseCase)