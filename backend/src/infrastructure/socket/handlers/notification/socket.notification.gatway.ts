import { INotificationDTO } from "../../../../application/dtos/notification.dto";
import { INotificationGateway } from "../../../../application/interfaces/notification/notification.gatway";
import { onlineUsers } from "../../context";

export class SocketNotificationGateway implements INotificationGateway {
	async notifyUser(userId: string, notification: INotificationDTO): Promise<void> {
		const userSocket = onlineUsers.get(userId);

		if (userSocket) {
			userSocket.emit("notify-user", notification);
			console.log(`🔔 Sent to ${userId}`);
		} else {
			console.log(`⚠️ User ${userId} offline – store in DB or skip.`);
		}
	}
}
