import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
	username: string;
	password: string;
	isSuperAdmin: boolean;
}

const AdminSchema: Schema = new Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isSuperAdmin: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

export const AdminModel = mongoose.model<IAdmin>("admins", AdminSchema);
