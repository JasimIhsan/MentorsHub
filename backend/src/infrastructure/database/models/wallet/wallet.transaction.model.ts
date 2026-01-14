import mongoose, { Document, Schema } from "mongoose";
import { RoleEnum } from "../../../../application/interfaces/enums/role.enum";
import { TransactionPurposeEnum } from "../../../../application/interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../../../../application/interfaces/enums/transaction.type.enum";

// 1. Interface
export interface IWalletTransactionDocument extends Document {
   _id: mongoose.Types.ObjectId;
   fromUserId: mongoose.Types.ObjectId;
   toUserId: mongoose.Types.ObjectId;
   fromRole: RoleEnum;
   toRole: RoleEnum;
   fromModel?: "Users" | "admins";
   toModel?: "Users" | "admins";
   sessionId?: mongoose.Types.ObjectId;
   amount: number;
   type: TransactionsTypeEnum;
   purpose: TransactionPurposeEnum;
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
         enum: ["credit", "debit", "withdrawal"],
         required: true,
      },
      purpose: {
         type: String,
         enum: ["session_fee", "platform_fee", "refund", "withdrawal", "wallet_topup", "platform_commission"],
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
