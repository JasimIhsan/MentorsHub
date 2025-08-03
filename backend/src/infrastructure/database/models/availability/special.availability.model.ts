import mongoose, { Document } from "mongoose";

export interface ISpecialAvailabilityDocument extends Document {
	_id: mongoose.Types.ObjectId;
	mentorId: mongoose.Types.ObjectId;
	date: Date;
	startTime: string;
	endTime: string;
	createdAt: Date;
	updatedAt: Date;
}

const SpecialAvailabilitySchema = new mongoose.Schema(
	{
		mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
		date: { type: Date, required: true },
		startTime: { type: String, required: true }, // "17:00"
		endTime: { type: String, required: true }, // "18:00"
	},
	{ timestamps: true }
);

export const SpecialAvailabilityModel = mongoose.model("Special-Availability", SpecialAvailabilitySchema);
