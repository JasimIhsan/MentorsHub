import { Request, Response, Router } from "express";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { ResponseBudgetActionList } from "aws-sdk/clients/deadline";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
export const userRouter = Router();

userRouter.get("/:userId", verifyAccessToken, requireRole("mentor", "user"), async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;
	const mentor = await MentorProfileModel.findOne({ userId }).populate("userId");
	if (!mentor || !mentor.userId) null;
	res.status(HttpStatusCode.OK).json(mentor);
});
