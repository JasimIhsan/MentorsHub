import { Router } from "express";
import { updateMentorProfileController } from "../../controllers/mentors/composer";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { upload } from "../../../infrastructure/file-upload/multer/multer.config";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";

export const mentorProfileRouter = Router();

mentorProfileRouter.put("/edit/:userId", verifyAccessToken, requireRole(RoleEnum.MENTOR), upload.fields([{ name: "avatar", maxCount: 1 }, { name: "documents" }]), (req, res, next) => updateMentorProfileController.handle(req, res, next));
