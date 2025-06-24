import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import dotenv from "dotenv";
import { downloadDocumentController, getDocumentsController } from "../../controllers/documents/composer";
import { DownloadDocumentsController } from "../../controllers/documents/download.documents.controller";

dotenv.config();

export const documentsRouter = Router();

documentsRouter.get("/:id/documents", verifyAccessToken, (req, res, next) => getDocumentsController.handle(req, res, next));

documentsRouter.get('/download-document', verifyAccessToken, (req, res, next) => downloadDocumentController.handle(req, res, next));