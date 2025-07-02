
import mongoose, { Schema, Document } from "mongoose";

export type NotificationType = "info" | "warning" | "success" | "error";

export interface INotificationDocument extends Document {
	_id: mongoose.Types.ObjectId;
	recipientId: mongoose.Types.ObjectId;
	// sender?: mongoose.Types.ObjectId; // Optional: who triggered the notification
	title: string;
	message: string;
	type: NotificationType; 
	link?: string; // Optional: link to redirect when clicked
	isRead: boolean; 
	createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
	{
		recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		// sender: { type: Schema.Types.ObjectId, ref: "User" },
		title: { type: String, required: true },
		message: { type: String, required: true },
		type: { type: String, enum: ["info", "warning", "success", "error"], default: "info" },
		link: { type: String },
		isRead: { type: Boolean, default: false },
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

export const NotificationModel = mongoose.model<INotificationDocument>("Notification", NotificationSchema);
