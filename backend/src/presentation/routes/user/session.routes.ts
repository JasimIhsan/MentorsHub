import { Request, Response, Router } from "express";
import { createSessionController, fetchSessionsByUserController, paySessionController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
export const sessionRouter = Router();

sessionRouter.post("/create-session",  (req, res) => createSessionController.handle(req, res));

sessionRouter.get("/all/:userId", verifyAccessToken, (req, res) => fetchSessionsByUserController.handle(req, res));

sessionRouter.put('/pay', (req, res) => paySessionController.handle(req, res));