import { Router } from "express";
import { createUserController, deleteUserController, getAllUserController, updateUserController, updateUserStatusController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/role";
export const usertabRouter = Router();

usertabRouter.get("/", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getAllUserController.handle(req, res, next));

usertabRouter.post("/create-user", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => createUserController.handle(req, res, next));

usertabRouter.put("/update-status/:userId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => updateUserStatusController.handle(req, res, next));

usertabRouter.delete("/delete-user/:id", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => deleteUserController.handle(req, res, next));

usertabRouter.put("/update-user/:userId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => updateUserController.handle(req, res, next));
