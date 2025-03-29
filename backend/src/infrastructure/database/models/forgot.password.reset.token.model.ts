import mongoose, { Schema, Document, ObjectId } from "mongoose";

interface IForgotPasswordTokens extends Document {
	userId: ObjectId;
	token: string;
	expires: Date;
}

const ForgotPasswordResetTokenSchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, required: true, ref: "Users" },
		token: { type: String, required: true },
		expiresAt: { type: Date, required: true },
	},
	{ timestamps: true }
);

export const ForgotTokenModel = mongoose.model<IForgotPasswordTokens>("Forgot Password Reset Token", ForgotPasswordResetTokenSchema);
