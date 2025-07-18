import mongoose, { Schema, Document } from "mongoose";
import { SessionStatusEnum } from "../../../../application/interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../../application/interfaces/enums/session.payment.status.enum";

export type SessionFormat = "one-on-one" | "group";
export type PricingType = "free" | "paid";

export interface ISessionParticipant {
	userId: mongoose.Types.ObjectId;
	paymentStatus: SessionPaymentStatusEnum;
	paymentId?: string;
}

export interface ISessionDocument extends Document {
	_id: mongoose.Types.ObjectId;
	participants: ISessionParticipant[];
	mentorId: mongoose.Types.ObjectId;
	topic: string;
	sessionFormat: SessionFormat;
	date: Date;
	time: string;
	hours: number;
	message: string;
	status: SessionStatusEnum;
	pricing: PricingType;
	totalAmount?: number;
	rejectReason?: string;
	createdAt: Date;
	updatedAt: Date;
}

const ParticipantSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		paymentStatus: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		paymentId: { type: String },
	},
	{ _id: false },
);

const SessionSchema = new Schema(
	{
		participants: { type: [ParticipantSchema], required: true },
		mentorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		topic: { type: String, required: true },
		sessionFormat: {
			type: String,
			enum: ["one-on-one", "group"],
			required: true,
			default: "one-on-one",
		},
		date: { type: Date, required: true },
		time: { type: String, required: true },
		hours: { type: Number, required: true },
		message: { type: String, required: true },
		status: {
			type: String,
			enum: ["upcoming", "completed", "canceled", "approved", "pending", "rejected", "expired", "ongoing"],
			default: "pending",
		},
		pricing: {
			type: String,
			enum: ["free", "paid"],
			default: "free",
		},
		totalAmount: { type: Number },
		rejectReason: { type: String },
	},
	{ timestamps: true },
);

export const SessionModel = mongoose.model<ISessionDocument>("Sessions", SessionSchema);
