// infrastructure/database/models/action-type.model.ts
import { Schema, model, Document } from "mongoose";

export interface IActionTypeDocument extends Document {
	_id: string; // key like "COMPLETE_SESSION"
	label: string; // e.g., "Complete session"
	createdAt: Date;
	updatedAt: Date;
}

const ActionTypeSchema = new Schema<IActionTypeDocument>(
	{
		_id: { type: String, required: true }, // slug/key
		label: { type: String, required: true },
	},
	{ timestamps: true },
);

export const ActionTypeModel = model<IActionTypeDocument>("ActionType", ActionTypeSchema);
