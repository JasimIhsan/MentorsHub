// models/message.model.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export type MessageType = "text" | "image" | "file";

export interface IMessage extends Document {
	chatId: mongoose.Types.ObjectId;
	sender: mongoose.Types.ObjectId;
	content: string;
	type: MessageType;
	fileUrl?: string;
	readBy: mongoose.Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
	{
		chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
		sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		content: { type: String, default: "" },
		type: {
			type: String,
			enum: ["text", "image", "file"],
			default: "text",
		},
		fileUrl: { type: String },
		readBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
	},
	{ timestamps: true },
);

// Indexes for performance
MessageSchema.index({ chatId: 1, createdAt: -1 }); // For pagination
MessageSchema.index({ chatId: 1, readBy: 1 }); // For unread filtering

export const MessageModel: Model<IMessage> = mongoose.model<IMessage>("Message", MessageSchema);
