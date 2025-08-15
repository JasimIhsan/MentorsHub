import mongoose, { Document, Schema } from "mongoose";
import { RescheduleStatusEnum } from "../../../../application/interfaces/enums/reschedule.status.enum";

export interface IRescheduleRequestDocument extends Document {
	_id: string;
	sessionId: mongoose.Types.ObjectId;
	initiatedBy: mongoose.Types.ObjectId;
	oldProposal: {
		proposedDate: Date;
		proposedStartTime: string;
		proposedEndTime: string;
	};
	currentProposal: {
		proposedDate: Date;
		proposedStartTime: string;
		proposedEndTime: string;
		message: string;
	};
	counterProposal?: {
		proposedDate: Date;
		proposedStartTime: string;
		proposedEndTime: string;
		message: string;
	};
	status: RescheduleStatusEnum;
	lastActionBy: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const RescheduleRequestSchema = new Schema(
	{
		sessionId: { type: Schema.Types.ObjectId, ref: "Sessions", required: true },

		initiatedBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },

		oldProposal: {
			proposedDate: { type: Date, required: true },
			proposedStartTime: { type: String, required: true },
			proposedEndTime: { type: String, required: true },
		},

		currentProposal: {
			proposedDate: { type: Date, required: true },
			proposedStartTime: { type: String, required: true },
			proposedEndTime: { type: String, required: true },
			message: { type: String },
		},

		counterProposal: {
			proposedDate: { type: Date },
			proposedStartTime: { type: String },
			proposedEndTime: { type: String },
			message: { type: String },
		},

		status: {
			type: String,
			enum: ["pending", "accepted", "rejected", "canceled"],
			default: "pending",
		},

		lastActionBy: { type: Schema.Types.ObjectId, ref: "Users" },
	},
	{ timestamps: true },
);

export const RescheduleRequestModel = mongoose.model<IRescheduleRequestDocument>("Reschedule-Request", RescheduleRequestSchema);
