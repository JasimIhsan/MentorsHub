import { Router } from "express";
import { createUserController, fetchAllUserController, updateUserStatusController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
export const usertabRouter = Router();

usertabRouter.get("/", verifyAccessToken, (req, res) => fetchAllUserController.handle(req, res));
usertabRouter.post("/create-user", verifyAccessToken, (req, res) => createUserController.handle(req, res));
usertabRouter.put("/update-status/:userId", verifyAccessToken, (req, res) => updateUserStatusController.handle(req, res));