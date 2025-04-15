import { Router } from "express";
import { becomeMentorApplicationController, changePasswordController, updateUseProfileController } from "../../controllers/user/composer";
import { upload } from "../../../infrastructure/file-upload/multer/multer.config";
import { uploadMentorDocument } from "../../../infrastructure/cloud/S3 bucket/upload.mentor.documents.s3";
export const userProfileRoutes = Router();

userProfileRoutes.put("/edit-profile", upload.single("avatar"), (req, res) => updateUseProfileController.handle(req, res));

userProfileRoutes.put("/change-password", (req, res) => changePasswordController.handle(req, res));

userProfileRoutes.post("/mentor-application", upload.array("documents"), (req, res) => becomeMentorApplicationController.handle(req, res));

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
