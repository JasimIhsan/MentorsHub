import { Router } from "express";
import { becomeMentorApplicationController, changePasswordController, getUserProfileController, reApplyMentorApplicationController, updateUseProfileController } from "../../controllers/user/composer";
import { upload } from "../../../infrastructure/file-upload/multer/multer.config";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/role";
export const userProfileRoutes = Router();

userProfileRoutes.get("/:userId", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => getUserProfileController.handle(req, res, next));

userProfileRoutes.put("/edit-profile", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), upload.single("avatar"), (req, res, next) => updateUseProfileController.handle(req, res, next));

userProfileRoutes.put("/change-password", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res, next) => changePasswordController.handle(req, res, next));

userProfileRoutes.post("/mentor-application", verifyAccessToken, requireRole(RoleEnum.USER), upload.array("documents"), (req, res, next) => becomeMentorApplicationController.handle(req, res, next));

userProfileRoutes.post("/mentor-application/resend", verifyAccessToken, requireRole(RoleEnum.USER), upload.array("documents"), (req, res, next) => reApplyMentorApplicationController.handle(req, res, next));
