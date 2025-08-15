import { MessageEntity, MessageType } from "../../../domain/entities/message.entity";
import { IMessageRepository } from "../../../domain/repositories/message.repository";
import { IChatRepository } from "../../../domain/repositories/chat.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { ISendMessageDTO, mapToSendMessageDTO } from "../../dtos/message.dto";
import { NotificationTypeEnum } from "../../interfaces/enums/notification.type.enum";
import { INotificationGateway } from "../../interfaces/usecases/notification/notification.gatway";

interface SendMessageInput {
	chatId?: string;
	sender: string;
	receiver: string;
	content: string;
	type: MessageType;
	fileUrl?: string;
}

export class SendMessageUseCase {
	constructor(private readonly messageRepo: IMessageRepository, private readonly chatRepo: IChatRepository, private readonly userRepo: IUserRepository, private readonly notifier: INotificationGateway) {}

	async execute(data: SendMessageInput): Promise<ISendMessageDTO> {
		const { chatId, sender, receiver, content, type, fileUrl } = data;

		const senderUser = await this.userRepo.findUserById(sender);
		if (!senderUser) throw new Error("Sender not found");

		const receiverUser = await this.userRepo.findUserById(receiver);
		if (!receiverUser) {
			await this.chatRepo.findPrivateBetween(sender, receiver);
		}

		let chat = chatId ? await this.chatRepo.findById(chatId) : await this.chatRepo.findPrivateBetween(sender, receiver);
		if (!chat) {
			chat = await this.chatRepo.create([sender, receiver], false);
		}

		const message = new MessageEntity({
			id: "",
			chat: chat.id,
			sender,
			content,
			type,
			fileUrl,
			readBy: [sender],
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const savedMessage = await this.messageRepo.create(message);
		await this.chatRepo.updateLastMessage(chat.id, savedMessage.id);

		// Send real-time notification (no DB storage)
		await this.notifier.notifyUser(receiver, {
			id: "",
			type: NotificationTypeEnum.NEW_MESSAGE,
			recipientId: receiver,
			title: "New message from " + senderUser.fullName,
			message: content,
			isRead: false,
			link: "/messages",
			createdAt: new Date(),
		});

		return mapToSendMessageDTO(savedMessage, senderUser);
	}
}
