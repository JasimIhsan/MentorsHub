import { getUserChatsUsecase } from "../../../application/usecases/text-message/composer";
import { GetUserChatsController } from "./get.user.chats.controller";

export const getUserChatsController = new GetUserChatsController(getUserChatsUsecase)