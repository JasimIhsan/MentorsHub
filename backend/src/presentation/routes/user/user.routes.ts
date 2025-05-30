import { Request, Response, Router } from "express";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { ResponseBudgetActionList } from "aws-sdk/clients/deadline";
import { HttpStatusCode } from "../../../shared/constants/http.status.codes";
export const userRouter = Router();

userRouter.get("/:userId", async (req: Request, res: Response) => {
	const userId = req.params.userId;
	const mentor = await MentorProfileModel.findOne({ userId }).populate("userId");
	if (!mentor || !mentor.userId) null;
	res.status(HttpStatusCode.OK).json(mentor);
});
