import { Router } from "express";
import { getMessagesByChatController, getUserChatsController } from "../../controllers/message/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
export const messageRouter = Router();

messageRouter.get("/chats/:userId", verifyAccessToken, (req, res, next) => getUserChatsController.handle(req, res, next));

messageRouter.get("/messages/:chatId", verifyAccessToken, (req, res, next) => getMessagesByChatController.handle(req, res, next));
