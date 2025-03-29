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
	interests: string[] | null;
	updatedAt: Date;
	skills: string[] | null;
	isActive: boolean | null;
	location: {
		city: string | null;
		country: string | null;
		timezone: string | null;
	};
	createdAt: Date;
	lastActive: Date | null;
	isVerified: boolean | null;
	mentorProfileId: ObjectId | null;
	mentorRequestStatus: "pending" | "approved" | "rejected" | null;
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
		lastName: { type: String, required: true },
		avatar: { type: String },
		bio: { type: String },
		interests: [{ type: String }],
		skills: [{ type: String }],
		isActive: { type: Boolean },
		location: {
			city: { type: String },
			country: { type: String },
			timezone: { type: String },
		},
		lastActive: { type: Date },
		isVerified: { type: Boolean },
		mentorProfileId: { type: Schema.Types.ObjectId, ref: "MentorProfile" },
		mentorRequestStatus: {
			type: String,
			enum: ["pending", "approved", "rejected"],
		},
		rating: { type: Number },
		sessionCompleted: { type: Number },
		featuredMentor: { type: Boolean },
		badges: [{ type: Schema.Types.ObjectId }],
		resetPasswordToken: { type: String },
      resetPasswordExpires: { type: Date },
	},
	{ timestamps: true }
);

export const UserModel = mongoose.model<IUsers>("Users", UsersSchema);
