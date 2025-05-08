import { Router } from "express";
import { becomeMentorApplicationController, changePasswordController, getUserProfileController, updateUseProfileController } from "../../controllers/user/composer";
import { upload } from "../../../infrastructure/file-upload/multer/multer.config";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
export const userProfileRoutes = Router();

userProfileRoutes.get("/", verifyAccessToken, (req, res) => getUserProfileController.handle(req, res));

userProfileRoutes.put("/edit-profile", verifyAccessToken, upload.single("avatar"), (req, res) => updateUseProfileController.handle(req, res));

userProfileRoutes.put("/change-password", verifyAccessToken, (req, res) => changePasswordController.handle(req, res));

userProfileRoutes.post("/mentor-application", verifyAccessToken, upload.array("documents"), (req, res) => becomeMentorApplicationController.handle(req, res));
