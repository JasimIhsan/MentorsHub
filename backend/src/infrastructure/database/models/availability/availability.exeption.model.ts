import mongoose, { Document } from "mongoose";

export interface IAvailabilityExceptionDocument extends Document {
	_id: mongoose.Types.ObjectId;
	mentorId: mongoose.Types.ObjectId;
	date: Date;
	blockType: string;
	partialBlocks: {
		startTime: string;
		endTime: string;
	}[];
	reason?: string;
	createdAt: Date;
	updatedAt: Date;
}

const AvailabilityExceptionSchema = new mongoose.Schema(
	{
		mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
		date: { type: Date, required: true },
		blockType: { type: String, enum: ["full", "partial"], required: true },
		partialBlocks: [
			{
				startTime: { type: String, required: true }, // e.g. "10:00"
				endTime: { type: String, required: true }, // e.g. "11:00"
			},
		],
		reason: { type: String }, // optional
	},
	{ timestamps: true },
);

export const AvailabilityExceptionModel = mongoose.model<IAvailabilityExceptionDocument>("Availability-Exception", AvailabilityExceptionSchema);
