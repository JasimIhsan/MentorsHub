import { Router } from "express";
import { getMessagesByChatController, getUserChatsController } from "../../controllers/message/composer";
export const messageRouter = Router();

messageRouter.get("/chats/:userId", (req, res, next) => getUserChatsController.handle(req, res, next));

messageRouter.get("/messages/:chatId", (req, res, next) => getMessagesByChatController.handle(req, res, next));