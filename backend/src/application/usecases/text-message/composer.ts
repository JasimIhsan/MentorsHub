import { chatRepository, messageRepository } from "../../../infrastructure/composer";
import { GetUserChatsUseCase } from "./get.chats.usecase";
import { GetMessagesByChatUseCase } from "./get.message.by.chat.usecase";
import { MarkMessageReadUseCase } from "./mark.messages.as.read.usecase";
import { SendMessageUseCase } from "./send.message.usecase";

export const sendMessageUsecase = new SendMessageUseCase(messageRepository, chatRepository);
export const markMessageAsReadUsecase = new MarkMessageReadUseCase(messageRepository);
export const getUserChatsUsecase = new GetUserChatsUseCase(chatRepository);
export const getMessagesByChatUsecase = new GetMessagesByChatUseCase(messageRepository);
