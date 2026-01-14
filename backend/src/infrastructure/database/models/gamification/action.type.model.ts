// infrastructure/database/models/action-type.model.ts
import { Document, Schema, model } from "mongoose";

export interface IActionTypeDocument extends Omit<Document, "_id"> {
   _id: string; // key like "COMPLETE_SESSION"
   label: string; // e.g., "Complete session"
   createdAt: Date;
   updatedAt: Date;
}

const ActionTypeSchema = new Schema(
   {
      _id: { type: String, required: true }, // slug/key
      label: { type: String, required: true },
   },
   { timestamps: true, _id: false }
);

export const ActionTypeModel = model<IActionTypeDocument>("ActionType", ActionTypeSchema);
