import { createNotificationUseCase, getUserNotificationsUseCase, markAllNotificationAsReadUseCase, markNotificationAsReadUseCase } from "../../../application/usecases/notification/composer";
import { CreateNotificationController } from "./create.notification.controller";
import { GetUserNotificationsController } from "./get.user.notification.controller";
import { MarkAllNotificationsAsReadController } from "./mark.all.notification.as.read.controller";
import { MarkNotificationAsReadController } from "./mark.notification.as.read.controller";

export const createNotificationController = new CreateNotificationController(createNotificationUseCase);
export const getUserNotificationsController = new GetUserNotificationsController(getUserNotificationsUseCase);
export const markNotificationAsReadController = new MarkNotificationAsReadController(markNotificationAsReadUseCase);
export const markAllNotificationAsReadController = new MarkAllNotificationsAsReadController(markAllNotificationAsReadUseCase);
