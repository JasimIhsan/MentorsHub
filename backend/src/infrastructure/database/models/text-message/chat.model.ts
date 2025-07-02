// models/chat.model.ts
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IChat extends Document {
	isGroupChat: boolean;
	name?: string;
	participants: mongoose.Types.ObjectId[];
	groupAdmin?: mongoose.Types.ObjectId;
	lastMessage?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
	{
		isGroupChat: { type: Boolean, default: false },
		name: { type: String }, // Only for group chats
		participants: [{ type: Schema.Types.ObjectId, ref: "Users", required: true }],
		groupAdmin: { type: Schema.Types.ObjectId, ref: "Users" },
		lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
	},
	{ timestamps: true },
);

export const ChatModel: Model<IChat> = mongoose.model<IChat>("Chat", ChatSchema);
