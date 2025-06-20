import { Router } from "express";
import { getMessagesByChatController, getUserChatsController } from "../../controllers/message/composer";
export const messageRouter = Router();

messageRouter.get("/chats/:userId", (req, res) => getUserChatsController.handle(req, res));

messageRouter.get("/messages/:chatId", (req, res) => getMessagesByChatController.handle(req, res));