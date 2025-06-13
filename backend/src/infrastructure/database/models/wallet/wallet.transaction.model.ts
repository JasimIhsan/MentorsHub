import mongoose, { Schema, Document, ObjectId } from "mongoose";

// 1. Interface
export interface IWalletTransactionDocument extends Document {
	_id: ObjectId;
	fromUserId: ObjectId;
	toUserId: ObjectId;
	fromRole: "user" | "mentor" | "admin";
	toRole: "user" | "mentor" | "admin";
	fromModel?: "Users" | "admins";
	toModel?: "Users" | "admins";
	sessionId?: ObjectId;
	amount: number;
	type: "credit" | "debit";
	purpose: "session_fee" | "platform_fee" | "refund" | "withdrawal" | "wallet_topup";
	description?: string;
	createdAt: Date;
	updatedAt: Date;
}

// 2. Schema
const WalletTransactionSchema = new Schema<IWalletTransactionDocument>(
	{
		// fromUserId with dynamic ref
		fromUserId: {
			type: Schema.Types.ObjectId,
			refPath: "fromModel",
		},
		fromRole: {
			type: String,
			enum: ["user", "mentor", "admin"],
			required: true,
		},
		fromModel: {
			type: String,
			required: true,
			enum: ["Users", "admins"],
			default: "Users",
		},

		// toUserId with dynamic ref
		toUserId: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "toModel",
		},
		toRole: {
			type: String,
			enum: ["user", "mentor", "admin"],
			required: true,
		},
		toModel: {
			type: String,
			enum: ["Users", "admins"],
			default: "Users",
		},

		// Other fields
		sessionId: {
			type: Schema.Types.ObjectId,
			ref: "Sessions",
		},
		amount: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			enum: ["credit", "debit"],
			required: true,
		},
		purpose: {
			type: String,
			enum: ["session_fee", "platform_fee", "refund", "withdrawal", "wallet_topup"],
			required: true,
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true }
);

// 3. Model export
export const WalletTransactionModel = mongoose.model<IWalletTransactionDocument>("WalletTransaction", WalletTransactionSchema);
