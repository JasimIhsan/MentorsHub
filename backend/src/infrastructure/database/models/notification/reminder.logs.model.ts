import mongoose, { Schema } from "mongoose";

const reminderLogSchema = new Schema(
	{
		sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		type: { type: String, enum: ["60", "10", "0"], required: true },
		sentAt: { type: Date, default: Date.now },
	},
	{ timestamps: true },
);

export const ReminderLogModel = mongoose.model("ReminderLog", reminderLogSchema);
