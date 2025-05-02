import { Router } from "express";
import { createUserController, deleteUserController, getAllUserController, updateUserController, updateUserStatusController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
export const usertabRouter = Router();

usertabRouter.get("/", verifyAccessToken, (req, res) => getAllUserController.handle(req, res));

usertabRouter.post("/create-user", verifyAccessToken, (req, res) => createUserController.handle(req, res));

usertabRouter.put("/update-status/:userId", verifyAccessToken, (req, res) => updateUserStatusController.handle(req, res));

usertabRouter.delete("/delete-user/:id", verifyAccessToken, (req, res) => deleteUserController.handle(req, res));

usertabRouter.put("/update-user/:userId", verifyAccessToken, (req, res) => updateUserController.handle(req, res));
