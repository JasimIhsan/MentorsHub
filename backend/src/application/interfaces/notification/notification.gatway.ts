import { NotificationEntity } from "../../../domain/entities/notification.entity";
import { INotificationDTO } from "../../dtos/notification.dto";
import { NotificationTypeEnum } from "../enums/notification.type.enum";


export interface INotificationGateway {
	notifyUser(userId: string, notification: INotificationDTO): Promise<void>;
}
