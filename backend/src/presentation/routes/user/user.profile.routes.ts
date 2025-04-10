import { Router } from "express";
import { updateUseProfileController } from "../../controllers/user/composer";
export const userProfileRoutes = Router();

userProfileRoutes.put("/edit-profile", (req, res) => updateUseProfileController.handle(req, res));
