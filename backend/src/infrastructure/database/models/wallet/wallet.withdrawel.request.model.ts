import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IWithdrawalRequestDocument extends Document {
	_id: ObjectId;
	mentorId: ObjectId;
	amount: number;
	status: "pending" | "approved" | "rejected" | "completed";
	requestedAt: Date;
	processedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequestDocument>(
	{
		mentorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		amount: { type: Number, required: true },
		status: {
			type: String,
			enum: ["pending", "approved", "rejected", "completed"],
			default: "pending",
		},
		requestedAt: { type: Date, default: Date.now },
		processedAt: { type: Date },
	},
	{ timestamps: true }
);

export const WithdrawalRequestModel = mongoose.model<IWithdrawalRequestDocument>("WithdrawalRequest", WithdrawalRequestSchema);
