// infrastructure/database/models/gamification.task.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IGamificationTaskDocument extends Document {
   _id: mongoose.Types.ObjectId;
   title: string;
   xpReward: number;
   targetCount: number;
   actionType: string;
   isListed: boolean;
   createdAt: Date;
   updatedAt: Date;
}

const GamificationTaskSchema = new Schema(
   {
      title: { type: String, required: true },
      xpReward: { type: Number, required: true },
      targetCount: { type: Number, required: true },
      actionType: { type: String, required: true },
      isListed: { type: Boolean, default: true },
   },
   {
      timestamps: true,
   }
);

export const GamificationTaskModel = mongoose.model<IGamificationTaskDocument>("GamificationTask", GamificationTaskSchema);
