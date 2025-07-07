import { Request, Response, Router } from "express";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
export const userRouter = Router();

userRouter.get("/:userId", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), async (req: Request, res: Response) => {
	const userId = req.params.userId;
	const mentor = await MentorProfileModel.findOne({ userId }).populate("userId");
	if (!mentor || !mentor.userId) null;
	res.status(HttpStatusCode.OK).json(mentor);
});
