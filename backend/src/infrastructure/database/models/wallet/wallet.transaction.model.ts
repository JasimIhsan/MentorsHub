import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IWalletTransactionDocument extends Document {
	_id: ObjectId;
	fromUserId: ObjectId;
	toUserId: ObjectId;
	fromRole: "user" | "mentor" | "admin";
	toRole: "user" | "mentor" | "admin";
	sessionId?: ObjectId;
	amount: number;
	type: "credit" | "debit";
	purpose: "session_fee" | "platform_fee" | "refund" | "withdrawal";
	description?: string;
	createdAt: Date;
	updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransactionDocument>(
	{
		fromUserId: { type: Schema.Types.ObjectId, ref: "Users" , required: true },
		toUserId: { type: Schema.Types.ObjectId, ref: "Users" , required: true },
		fromRole: { type: String, enum: ["user", "mentor", "admin"] },
		toRole: { type: String, enum: ["user", "mentor", "admin"] },
		sessionId: { type: Schema.Types.ObjectId, ref: "Sessions" },
		amount: { type: Number, required: true },
		type: { type: String, enum: ["credit", "debit"], required: true },
		purpose: {
			type: String,
			enum: ["session_fee", "platform_fee", "refund", "withdrawal"],
			required: true,
		},
		description: { type: String },
	},
	{ timestamps: true }
);

export const WalletTransactionModel = mongoose.model<IWalletTransactionDocument>("WalletTransaction", WalletTransactionSchema);
