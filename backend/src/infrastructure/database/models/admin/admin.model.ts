import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
	name: string
	username: string;
	password: string;
	isSuperAdmin: boolean;
	avatar: string
}

const AdminSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isSuperAdmin: { type: Boolean, required: true, default: false },
		avatar: { type: String },
	},
	{ timestamps: true }
);

export const AdminModel = mongoose.model<IAdmin>("admins", AdminSchema);
