import { chatRepository, messageRepository, notifierGateway, userRepository } from "../../../infrastructure/composer";
import { DeleteMessageUseCase } from "./delete.message.usecase";
import { GetUserChatsUseCase } from "./get.chats.usecase";
import { GetMessagesByChatUseCase } from "./get.message.by.chat.usecase";
import { GetMessageUnreadCountUseCase } from "./get.unread.count.usecase";
import { MarkMessageAsReadUseCase } from "./mark.message.as.read.usecase";
import { MarkAllMessagesAsReadUseCase } from "./mark.messages.as.read.usecase";
import { SendMessageUseCase } from "./send.message.usecase";
import { UpdateUnreadCountsForChatUseCase } from "./update.unread.count.for.chat";

export const sendMessageUsecase = new SendMessageUseCase(messageRepository, chatRepository, userRepository, notifierGateway);
export const markMessagesAsReadUsecase = new MarkAllMessagesAsReadUseCase(messageRepository);
export const getUserChatsUsecase = new GetUserChatsUseCase(chatRepository, userRepository, messageRepository);
export const getMessagesByChatUsecase = new GetMessagesByChatUseCase(messageRepository, userRepository);
export const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository, chatRepository);
export const getMessageUnreadCountsByUser = new GetMessageUnreadCountUseCase(messageRepository);
export const markMessageAsReadUseCase = new MarkMessageAsReadUseCase(messageRepository);
export const updateUnreadCountsForChatUseCase = new UpdateUnreadCountsForChatUseCase(chatRepository);
