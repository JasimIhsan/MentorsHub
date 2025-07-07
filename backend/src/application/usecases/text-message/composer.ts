import { chatRepository, messageRepository, userRepository } from "../../../infrastructure/composer";
import { DeleteMessageUseCase } from "./delete.message.usecase";
import { GetUserChatsUseCase } from "./get.chats.usecase";
import { GetMessagesByChatUseCase } from "./get.message.by.chat.usecase";
import { GetMessageUnreadCountUseCase } from "./get.unread.count.usecase";
import { MarkMessageReadUseCase } from "./mark.messages.as.read.usecase";
import { SendMessageUseCase } from "./send.message.usecase";

export const sendMessageUsecase = new SendMessageUseCase(messageRepository, chatRepository, userRepository);
export const markMessageAsReadUsecase = new MarkMessageReadUseCase(messageRepository, userRepository);
export const getUserChatsUsecase = new GetUserChatsUseCase(chatRepository, userRepository, messageRepository);
export const getMessagesByChatUsecase = new GetMessagesByChatUseCase(messageRepository, userRepository);
export const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository, chatRepository);
export const getMessageUnreadCountsByUser = new GetMessageUnreadCountUseCase(messageRepository);
