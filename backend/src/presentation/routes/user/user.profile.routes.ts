import { Router } from "express";
import { updateUseProfileController } from "../../controllers/user/composer";
import upload from "../../../infrastructure/file-upload/multer/multer.config";
export const userProfileRoutes = Router();

userProfileRoutes.put("/edit-profile", upload.single("avatar"), (req, res) => updateUseProfileController.handle(req, res));
