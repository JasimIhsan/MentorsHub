import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import dotenv from "dotenv";
import { getDocumentsController } from "../../controllers/documents/composer";

dotenv.config();

export const documentsRouter = Router();

documentsRouter.get("/:id/documents", verifyAccessToken, (req, res, next) => getDocumentsController.handle(req, res, next));
