import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { RoleEnum } from "../../../../application/interfaces/enums/role.enum";
import { MentorRequestStatusEnum } from "../../../../application/interfaces/enums/mentor.request.status.enum";

export interface IUsersDocument extends Document {
	_id: ObjectId;
	email: string;
	password: string;
	firstName: string;
	role: RoleEnum.USER | RoleEnum.MENTOR;
	lastName: string;
	avatar: string | null;
	bio: string | null;
	interests: string[] | null;
	updatedAt: Date;
	skills: string[] | null;
	status: "blocked" | "unblocked";
	mentorRequestStatus: MentorRequestStatusEnum;
	createdAt: Date;
	averageRating: number | null;
	totalReviews: number | null;
	sessionCompleted: number | null;
	badges: string[] | null;
	googleId: string | null;
}

const UsersSchema: Schema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		role: { type: String, enum: ["user", "mentor"], required: true, default: "user" },
		lastName: { type: String },
		avatar: { type: String },
		bio: { type: String },
		interests: [{ type: String }],
		skills: [{ type: String }],
		status: { type: String, enum: ["blocked", "unblocked"], default: "unblocked" },
		mentorRequestStatus: {
			type: String,
			enum: ["pending", "approved", "rejected", "not-requested"],
			default: "not-requested",
		},
		averageRating: { type: Number, default: 0 },
		totalReviews: { type: Number, default: 0 },
		sessionCompleted: { type: Number },
		badges: [{ type: Schema.Types.ObjectId }],
		googleId: { type: String },
	},
	{ timestamps: true },
);

export const UserModel = mongoose.model<IUsersDocument>("Users", UsersSchema);
