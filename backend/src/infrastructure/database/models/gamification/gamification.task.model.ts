// infrastructure/database/models/gamification.task.model.ts
import mongoose, { Document, Schema } from "mongoose";
import { GamificationTaskType } from "../../../../domain/entities/gamification.task.entity";

export interface IGamificationTaskDocument extends Document {
	_id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: GamificationTaskType;
	createdAt: Date;
	updatedAt: Date;
}

const GamificationTaskSchema = new Schema(
	{
		title: { type: String, required: true },
		xpReward: { type: Number, required: true },
		targetCount: { type: Number, required: true },
		actionType: {
			type: String,
			required: true,
			enum: ["COMPLETE_SESSION", "GIVE_FEEDBACK"],
		},
	},
	{
		timestamps: true,
	}
);

export const GamificationTaskModel = mongoose.model<IGamificationTaskDocument>("GamificationTask", GamificationTaskSchema);
