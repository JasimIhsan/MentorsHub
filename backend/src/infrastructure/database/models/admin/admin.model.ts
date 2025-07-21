import mongoose, { Schema, Document } from "mongoose";
import { RoleEnum } from "../../../../application/interfaces/enums/role.enum";

export interface IAdmin extends Document {
	name: string;
	username: string;
	password: string;
	role: RoleEnum.ADMIN;
	avatar: string;
}

const AdminSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["admin"], required: true, default: RoleEnum.ADMIN },
		avatar: { type: String },
	},
	{ timestamps: true },
);

export const AdminModel = mongoose.model<IAdmin>("admins", AdminSchema);
