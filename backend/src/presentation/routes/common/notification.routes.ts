import express from "express";
import { createNotificationController, getUserNotificationsController, markNotificationAsReadController, markAllNotificationAsReadController } from "../../controllers/notification/composer";

export const notificationRouter = express.Router();

notificationRouter.post("/", (req, res, next) => createNotificationController.handle(req, res, next));
notificationRouter.get("/:userId", (req, res, next) => getUserNotificationsController.handle(req, res, next));
notificationRouter.patch("/read/:notificationId", (req, res, next) => markNotificationAsReadController.handle(req, res, next));
notificationRouter.patch("/read-all/:userId", (req, res, next) => markAllNotificationAsReadController.handle(req, res, next));
