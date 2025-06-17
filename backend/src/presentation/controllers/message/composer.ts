import { getMessagesByChatUsecase, getUserChatsUsecase } from "../../../application/usecases/text-message/composer";
import { GetMessagesByChatController } from "./get.message.by.chat.controller";
import { GetUserChatsController } from "./get.user.chats.controller";

export const getUserChatsController = new GetUserChatsController(getUserChatsUsecase)
export const getMessagesByChatController = new GetMessagesByChatController(getMessagesByChatUsecase)