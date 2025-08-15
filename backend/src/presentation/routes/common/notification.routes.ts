import express from "express";
import { createNotificationController, getUserNotificationsController, markNotificationAsReadController, markAllNotificationAsReadController } from "../../controllers/notification/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";

export const notificationRouter = express.Router();

notificationRouter.post("/", verifyAccessToken, (req, res, next) => createNotificationController.handle(req, res, next));
notificationRouter.get("/:userId", verifyAccessToken, (req, res, next) => getUserNotificationsController.handle(req, res, next));
notificationRouter.patch("/read/:notificationId", verifyAccessToken, (req, res, next) => markNotificationAsReadController.handle(req, res, next));
notificationRouter.patch("/read-all/:userId", verifyAccessToken, (req, res, next) => markAllNotificationAsReadController.handle(req, res, next));
