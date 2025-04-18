import { Router } from "express";
import { becomeMentorApplicationController, changePasswordController, fetchUserProfileController, updateUseProfileController } from "../../controllers/user/composer";
import { upload } from "../../../infrastructure/file-upload/multer/multer.config";
import { uploadMentorDocument } from "../../../infrastructure/cloud/S3 bucket/upload.mentor.documents.s3";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
export const userProfileRoutes = Router();

userProfileRoutes.get("/", verifyAccessToken, (req, res) => fetchUserProfileController.handle(req, res));

userProfileRoutes.put("/edit-profile", verifyAccessToken, upload.single("avatar"), (req, res) => updateUseProfileController.handle(req, res));

userProfileRoutes.put("/change-password", verifyAccessToken, (req, res) => changePasswordController.handle(req, res));

userProfileRoutes.post("/mentor-application", verifyAccessToken, upload.array("documents"), (req, res) => becomeMentorApplicationController.handle(req, res));
