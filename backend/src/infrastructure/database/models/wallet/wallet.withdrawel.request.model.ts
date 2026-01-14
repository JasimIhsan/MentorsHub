import mongoose, { Document, Schema } from "mongoose";
import { WithdrawalRequestStatusEnum } from "../../../../application/interfaces/enums/withdrawel.request.status.enum";

export interface IWithdrawalRequestDocument extends Document {
   userId: mongoose.Types.ObjectId;
   amount: number;
   status: WithdrawalRequestStatusEnum;
   transactionId?: mongoose.Types.ObjectId;
   processedAt?: Date;
   createdAt: Date;
   updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequestDocument>(
   {
      userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
      amount: { type: Number, required: true },
      status: {
         type: String,
         enum: Object.values(WithdrawalRequestStatusEnum),
         default: WithdrawalRequestStatusEnum.PENDING,
      },
      transactionId: { type: Schema.Types.ObjectId, ref: "WalletTransaction" },
      processedAt: { type: Date },
   },
   { timestamps: true }
);

export const WithdrawalRequestModel = mongoose.model<IWithdrawalRequestDocument>("Withdrawal-Request", WithdrawalRequestSchema);
