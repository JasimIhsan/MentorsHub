import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IUsers extends Document {
	_id: ObjectId;
	email: string;
	password: string;
	firstName: string;
	role: "user" | "mentor";
	lastName: string;
	avatar: string | null;
	bio: string | null;
	interests: object[] | null;
	updatedAt: Date;
	skills: object[] | null;
	status: "blocked" | "unblocked";
	mentorRequestStatus: "pending" | "approved" | "rejected" | "not-requested";
	createdAt: Date;
	lastActive: Date | null;
	isVerified: boolean | null;
	mentorProfileId: ObjectId | null;
	rating: number | null;
	sessionCompleted: number | null;
	featuredMentor: boolean | null;
	badges: ObjectId[] | null;
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
		lastActive: { type: Date },
		isVerified: { type: Boolean },
		mentorRequestStatus: {
			type: String,
			enum: ["pending", "approved", "rejected", "not-requested"],
			default: "not-requested",
		},
		rating: { type: Number },
		sessionCompleted: { type: Number },
		featuredMentor: { type: Boolean },
		badges: [{ type: Schema.Types.ObjectId }],
		googleId: { type: String },
	},
	{ timestamps: true }
);

export const UserModel = mongoose.model<IUsers>("Users", UsersSchema);
