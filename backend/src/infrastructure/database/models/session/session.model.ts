import mongoose, { Document, Schema } from "mongoose";

export interface ISessionDocument extends Document {
	_id: mongoose.Types.ObjectId;
	mentorId: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	topic: string;
	sessionType: string;
	sessionFormat: string;
	date: Date;
	time: string;
	hours: number;
	message: string;
	status: "upcoming" | "completed" | "canceled" | "approved" | "pending";
	paymentStatus?: "pending" | "completed" | "failed";
	rejectReason?: string;
	pricing: "free" | "paid";
	paymentId?: string;
	totalAmount?: number;
	createdAt: Date;
}

const SessionRequestSchema: Schema = new Schema<ISessionDocument>(
	{
		mentorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		topic: { type: String, required: true },
		sessionType: { type: String, required: true },
		sessionFormat: { type: String, required: true },
		date: { type: Date, required: true },
		time: { type: String, required: true },
		hours: { type: Number, required: true },
		message: { type: String, required: true },
		status: {
			type: String,
			enum: ["upcoming", "completed", "canceled", "approved", "pending"],
			default: "pending",
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		pricing: {
			type: String,
			enum: ["free", "paid"],
			default: "free",
		},
		rejectReason: { type: String },
		paymentId: { type: String },
		totalAmount: { type: Number },
	},
	{ timestamps: true }
);

export const SessionModel = mongoose.model<ISessionDocument>("Sessions", SessionRequestSchema);
