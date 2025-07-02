import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
	name: string
	username: string;
	password: string;
	role: "admin" | "super-admin";
	avatar: string
}

const AdminSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["admin", "super-admin"], required: true, default: "admin" },
		avatar: { type: String },
	},
	{ timestamps: true },
);

export const AdminModel = mongoose.model<IAdmin>("admins", AdminSchema);
