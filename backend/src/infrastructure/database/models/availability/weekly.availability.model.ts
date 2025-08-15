import mongoose, { Document } from "mongoose";

export interface IWeeklyAvailabilityDocument extends Document {
	_id: mongoose.Types.ObjectId;
	mentorId: mongoose.Types.ObjectId;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const WeeklyAvailabilitySchema = new mongoose.Schema(
	{
		mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
		dayOfWeek: { type: Number, required: true }, // 0 = Sunday ... 6 = Saturday
		startTime: { type: String, required: true }, // "14:00"
		endTime: { type: String, required: true }, // "15:00"
		isActive: { type: Boolean, default: true }, // soft disable any slot
	},
	{ timestamps: true },
);

export const WeeklyAvailabilityModel = mongoose.model<IWeeklyAvailabilityDocument>("Weekly-Availability", WeeklyAvailabilitySchema);
