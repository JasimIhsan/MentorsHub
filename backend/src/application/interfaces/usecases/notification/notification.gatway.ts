import { INotificationDTO } from "../../../dtos/notification.dto";


export interface INotificationGateway {
	notifyUser(userId: string, notification: INotificationDTO): Promise<void>;
}
