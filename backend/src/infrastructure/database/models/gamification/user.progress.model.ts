import mongoose, { Document, Schema } from "mongoose";

export interface IUserProgressDocument extends Document {
	userId: string;
	totalXP: number;
	level: number;
	tasksCompleted: number;
	xpToNextLevel: number;
	createdAt: Date;
	updatedAt: Date;
}

const UserProgressSchema = new Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true, unique: true },
		totalXP: { type: Number, default: 0 },
		level: { type: Number, default: 1 },
		tasksCompleted: { type: Number, default: 0 },
		xpToNextLevel: { type: Number, default: 100 },
	},
	{ timestamps: true },
);

export const UserProgressModel = mongoose.model<IUserProgressDocument>("User_Progress", UserProgressSchema);
