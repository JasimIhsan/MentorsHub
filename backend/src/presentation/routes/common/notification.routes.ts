import express from "express";
import { createNotificationController, getUserNotificationsController, markNotificationAsReadController, markAllNotificationAsReadController } from "../../controllers/notification/composer";

export const notificationRouter = express.Router();

notificationRouter.post("/", (req, res) => createNotificationController.handle(req, res));
notificationRouter.get("/:userId", (req, res) => getUserNotificationsController.handle(req, res));
notificationRouter.patch("/read/:notificationId", (req, res) => markNotificationAsReadController.handle(req, res));
notificationRouter.patch("/read-all/:userId", (req, res) => markAllNotificationAsReadController.handle(req, res));
