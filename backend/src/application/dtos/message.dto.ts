import { MessageEntity } from "../../domain/entities/message.entity";
import { UserEntity } from "../../domain/entities/user.entity";

export interface ISendMessageDTO {
	id: string;
	chatId: string;
	sender: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
	};
	content: string;
	type: "text" | "image" | "file" | "video";
	fileUrl?: string;
	readBy: string[]; // array of user IDs who have read this message
	createdAt: Date;
	updatedAt: Date;
}

export function mapToSendMessageDTO(message: MessageEntity, sender: UserEntity): ISendMessageDTO {
	return {
		id: message.id,
		chatId: message.chatId,
		sender: {
			id: sender.id!,
			firstName: sender.firstName,
			lastName: sender.lastName,
			avatar: sender.avatar || undefined,
		},
		content: message.content,
		type: message.type,
		fileUrl: message.fileUrl,
		readBy: message.readBy,
		createdAt: message.createdAt,
		updatedAt: message.updatedAt,
	};
}
