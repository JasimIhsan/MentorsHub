import mongoose, { Document, Schema } from "mongoose";

export interface IUserTaskProgressDocument extends Document {
	_id: string;
	userId: string;
	taskId: string;
	currentCount: number;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const UserTaskProgressSchema = new Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		taskId: { type: mongoose.Schema.Types.ObjectId, ref: "GamificationTask", required: true },
		currentCount: { type: Number, default: 0 },
		completed: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

// Ensure one progress record per (user + task)
UserTaskProgressSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export const UserTaskProgressModel = mongoose.model<IUserTaskProgressDocument>("UserTaskProgress", UserTaskProgressSchema);
