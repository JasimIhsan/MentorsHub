import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { RoleEnum } from "../../../../application/interfaces/enums/role";

export interface IWalletDocument extends Document {
	_id: ObjectId;
	userId: ObjectId;
	role: RoleEnum;
	balance: number;
	createdAt: Date;
	updatedAt: Date;
}

const WalletSchema = new Schema<IWalletDocument>(
	{
		userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		role: { type: String, enum: ["user", "mentor", "admin"], required: true },
		balance: { type: Number, required: true, default: 0 },
	},
	{ timestamps: true },
);

// Optional: one wallet per user-role combination
WalletSchema.index({ userId: 1, role: 1 }, { unique: true });

export const WalletModel = mongoose.model<IWalletDocument>("Wallet", WalletSchema);
