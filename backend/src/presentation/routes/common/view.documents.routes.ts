import AWS from "aws-sdk";
import { Request, Response, Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { UserEntity } from "../../../domain/entities/user.entity";
import { AdminEntity } from "../../../domain/entities/admin.entity";
import { MentorProfileModel } from "../../../infrastructure/database/models/user/mentor.details.model";
import { MentorDetailsRepositoryImpl } from "../../../infrastructure/database/implementation/mentor.respository.impl";
import dotenv from "dotenv";

dotenv.config();

export const documentsRouter = Router();

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

export interface CustomRequest extends Request {
	user: UserEntity | AdminEntity;
}

const mentorRepo = new MentorDetailsRepositoryImpl();

documentsRouter.get("/:id/documents", verifyAccessToken, async (req: Request, res: Response) => {
	console.log(`in get documents`);

	const mentorId = req.params.id;
	const customReq = req as CustomRequest;
	const loggedInUserId = customReq.user.getId();
	const isAdmin = customReq.user.getProfile().role === "admin";

	console.log("mentorId in documents: ", mentorId);
	console.log("loggedInUserId: ", loggedInUserId);

	// const mentor = await MentorProfileModel.findOne({ userId: mentorId }).populate("userId");
	const mentor = await mentorRepo.findMentorByUserId(mentorId);
	console.log("mentor found: ", mentor);

	if (!mentor) {
		res.status(404).json({ message: "Mentor not found" });
		return;
	}

	console.log(`mentor userId  : `, mentor.userId);
	console.log(`loggedInUserId : `, loggedInUserId);

	const isOwner = mentor.userId.toString() === loggedInUserId;

	console.log("isOwner: ", isOwner);
	console.log("isAdmin: ", isAdmin);

	if (!isOwner && !isAdmin) {
		res.status(403).json({ message: "Access denied" });
		return;
	}

	const signedUrls = await Promise.all(
		mentor.documents.map((fileKey) => {
			const params = {
				Bucket: process.env.AWS_BUCKET_NAME,
				Key: fileKey,
				Expires: 60 * 5, // 5 minutes
			};
			return s3.getSignedUrlPromise("getObject", params);
		})
	);
	res.json({ success: true, documents: signedUrls });
});
