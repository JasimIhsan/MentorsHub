import { Router } from "express";
import { getUserChatsController } from "../../controllers/message/composer";
export const messageRouter = Router();

messageRouter.get("/chats/:userId", (req, res) => getUserChatsController.handle(req, res));
