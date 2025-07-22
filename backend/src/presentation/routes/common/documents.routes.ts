import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import dotenv from "dotenv";
import { downloadDocumentController, getDocumentByKeyController, getDocumentsController } from "../../controllers/documents/composer";

dotenv.config();

export const documentsRouter = Router();

documentsRouter.get("/:id/documents", verifyAccessToken, (req, res, next) => getDocumentsController.handle(req, res, next));

documentsRouter.get("/:id/document", verifyAccessToken, (req, res, next) => getDocumentByKeyController.handle(req, res, next));

documentsRouter.get("/download-document", verifyAccessToken, (req, res, next) => downloadDocumentController.handle(req, res, next));