import { Router } from "express";
import { becomeMentorApplicationController, changePasswordController, getUserProfileController, reApplyMentorApplicationController, updateUseProfileController } from "../../controllers/user/composer";
import { upload } from "../../../infrastructure/file-upload/multer/multer.config";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
export const userProfileRoutes = Router();

userProfileRoutes.get("/:userId", verifyAccessToken, requireRole("mentor", "user"), (req, res) => getUserProfileController.handle(req, res));

userProfileRoutes.put("/edit-profile", verifyAccessToken, requireRole("mentor", "user"), upload.single("avatar"), (req, res) => updateUseProfileController.handle(req, res));

userProfileRoutes.put("/change-password", verifyAccessToken, requireRole("mentor", "user"), (req, res) => changePasswordController.handle(req, res));

userProfileRoutes.post("/mentor-application", verifyAccessToken, requireRole("user"), upload.array("documents"), (req, res) => becomeMentorApplicationController.handle(req, res));

userProfileRoutes.post("/mentor-application/resend", verifyAccessToken, requireRole("user"), upload.array("documents"), (req, res) => reApplyMentorApplicationController.handle(req, res));
