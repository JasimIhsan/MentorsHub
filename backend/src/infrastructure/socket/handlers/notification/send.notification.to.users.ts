import { sendNotificationToUser } from "./send.notification.to.user";

export function notifyMultipleSpecificUsers(userIds: string[], message: string) {
	userIds.forEach((userId) => sendNotificationToUser(userId, message));
}
