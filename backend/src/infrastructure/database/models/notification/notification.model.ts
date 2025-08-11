import mongoose, { Schema, Document } from "mongoose";
import { NotificationTypeEnum } from "../../../../application/interfaces/enums/notification.type.enum";

export interface INotificationDocument extends Document {
	_id: mongoose.Types.ObjectId;
	recipientId: mongoose.Types.ObjectId;
	// sender?: mongoose.Types.ObjectId; // Optional: who triggered the notification
	title: string;
	message: string;
	type: NotificationTypeEnum;
	link?: string; // Optional: link to redirect when clicked
	isRead: boolean;
	createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
	{
		recipientId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		// sender: { type: Schema.Types.ObjectId, ref: "Users" },
		title: { type: String, required: true },
		message: { type: String, required: true },
		type: { type: String, enum: ["info", "warning", "success", "error", "reminder", "review", "payment", "task_completed", "welcome", "session", "new_message", "reschedule_request"], default: "info" },
		link: { type: String },
		isRead: { type: Boolean, default: false },
	},
	{ timestamps: { createdAt: true, updatedAt: false } },
);

export const NotificationModel = mongoose.model<INotificationDocument>("Notification", NotificationSchema);
