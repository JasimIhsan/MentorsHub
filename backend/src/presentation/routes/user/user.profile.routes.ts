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

// userProfileRoutes.post("/posts", upload.single("image"), async (req, res) => {
// 	try {
// 		console.log(`in posts`);

// 		const image = req.file;
// 		console.log("image: ", image);
// 		if (!image) return;

// 		const url = await uploadMentorDocument(image?.buffer, image?.originalname, image?.mimetype, "1212");

// 		res.status(200).json({ success: true, message: "Posts fetched successfully", data: url });
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			console.error("Posts error:", error.message);
// 			res.status(400).json({ success: false, message: error.message });
// 			return;
// 		}
// 		res.status(500).json({ success: false, message: "Internal Server Error" });
// 	}
// });
