import { Router } from "express";
import { createUserController, deleteUserController, getAllUserController, updateUserController, updateUserStatusController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
export const usertabRouter = Router();

usertabRouter.get("/", verifyAccessToken, requireRole("admin"), (req, res, next) => getAllUserController.handle(req, res, next));

usertabRouter.post("/create-user", verifyAccessToken, requireRole("admin"), (req, res, next) => createUserController.handle(req, res, next));

usertabRouter.put("/update-status/:userId", verifyAccessToken, requireRole("admin"), (req, res, next) => updateUserStatusController.handle(req, res, next));

usertabRouter.delete("/delete-user/:id", verifyAccessToken, requireRole("admin"), (req, res, next) => deleteUserController.handle(req, res, next));

usertabRouter.put("/update-user/:userId", verifyAccessToken, requireRole("admin"), (req, res, next) => updateUserController.handle(req, res, next));
