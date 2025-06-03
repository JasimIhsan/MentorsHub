import { Router } from "express";
import { createUserController, deleteUserController, getAllUserController, updateUserController, updateUserStatusController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
export const usertabRouter = Router();

usertabRouter.get("/", verifyAccessToken, requireRole("admin"), (req, res) => getAllUserController.handle(req, res));

usertabRouter.post("/create-user", verifyAccessToken, requireRole("admin"), (req, res) => createUserController.handle(req, res));

usertabRouter.put("/update-status/:userId", verifyAccessToken, requireRole("admin"), (req, res) => updateUserStatusController.handle(req, res));

usertabRouter.delete("/delete-user/:id", verifyAccessToken, requireRole("admin"), (req, res) => deleteUserController.handle(req, res));

usertabRouter.put("/update-user/:userId", verifyAccessToken, requireRole("admin"), (req, res) => updateUserController.handle(req, res));
