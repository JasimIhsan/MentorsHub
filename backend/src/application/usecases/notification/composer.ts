import { notificationRepository, notifierGateway } from "../../../infrastructure/composer";
import { CreateNotificationUseCase } from "./create.notification.usecase";
import { GetUserNotificationsUseCase } from "./get.user.notification.usecase";
import { MarkAllNotificationsAsReadUseCase } from "./mark.all.notification.as.read.usecase";
import { MarkNotificationAsReadUseCase } from "./mark.notification.as.read.usecase";
import { NotifyUserUseCase } from "./notify.user.usecase";

export const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository);
export const getUserNotificationsUseCase = new GetUserNotificationsUseCase(notificationRepository);
export const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
export const markAllNotificationAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepository);
export const notifyUserUseCase = new NotifyUserUseCase(notificationRepository, notifierGateway);
