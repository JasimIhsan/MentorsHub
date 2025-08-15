import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { RefundInitiatorEnum, RefundStatusEnum } from "../../../../application/interfaces/enums/refund.enums";

export interface IRefundDocument extends Document {
	_id: ObjectId;
	sessionId: ObjectId; // Related session
	paymentId: string; // Gateway payment ID (Stripe/Razorpay)
	userId: ObjectId; // User getting refunded
	initiatedBy: RefundInitiatorEnum;
	reason?: string;
	originalAmount: number; // Full amount paid
	refundAmount: number; // Amount being refunded
	platformFeeRefunded: boolean;
	walletTransactionId?: ObjectId; // Link to WalletTransaction if WALLET method
	status: RefundStatusEnum;
	processedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const RefundSchema = new Schema<IRefundDocument>(
	{
		sessionId: { type: Schema.Types.ObjectId, ref: "Sessions", required: true },
		paymentId: { type: String, required: true },
		userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		initiatedBy: {
			type: String,
			enum: Object.values(RefundInitiatorEnum),
			required: true,
		},
		reason: { type: String },
		originalAmount: { type: Number, required: true },
		refundAmount: { type: Number, required: true },
		platformFeeRefunded: { type: Boolean, default: false },
		walletTransactionId: {
			type: Schema.Types.ObjectId,
			ref: "WalletTransaction",
		},
		status: {
			type: String,
			enum: Object.values(RefundStatusEnum),
			default: RefundStatusEnum.REQUESTED,
		},
		processedAt: { type: Date },
	},
	{ timestamps: true },
);

export const RefundModel = mongoose.model<IRefundDocument>("Refund", RefundSchema);
