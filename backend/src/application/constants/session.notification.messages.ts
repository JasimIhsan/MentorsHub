import { NotificationTypeEnum } from "../interfaces/enums/notification.type.enum";
import { SessionStatusEnum } from "../interfaces/enums/session.status.enums";

export const SessionStatusNotificationMap: Record<SessionStatusEnum, { title: string; msg: (topic: string) => string; type: NotificationTypeEnum }> = {
	[SessionStatusEnum.APPROVED]: {
		title: "📆 Session Approved",
		msg: (topic) => `Your session "${topic}" has been approved by the mentor.`,
		type: NotificationTypeEnum.SUCCESS,
	},
	[SessionStatusEnum.COMPLETED]: {
		title: "📆 Session Completed",
		msg: (topic) => `Great! Session "${topic}" is marked as completed.`,
		type: NotificationTypeEnum.SUCCESS,
	},
	[SessionStatusEnum.CANCELED]: {
		title: "📆 Session Cancelled",
		msg: (topic) => `Unfortunately, session "${topic}" was cancelled.`,
		type: NotificationTypeEnum.ERROR,
	},
	[SessionStatusEnum.REJECTED]: {
		title: "📆 Session Rejected",
		msg: (topic) => `Unfortunately, session "${topic}" was rejected.`,
		type: NotificationTypeEnum.ERROR,
	},
	[SessionStatusEnum.EXPIRED]: {
		title: "📆 Session Expired",
		msg: (topic) => `Unfortunately, session "${topic}" has expired.`,
		type: NotificationTypeEnum.ERROR,
	},
	[SessionStatusEnum.PENDING]: {
		title: "📆 Session Pending",
		msg: (topic) => `Your session "${topic}" is still pending approval.`,
		type: NotificationTypeEnum.INFO,
	},
	[SessionStatusEnum.UPCOMING]: {
		title: "📆 Upcoming Session",
		msg: (topic) => `Your session "${topic}" is coming up soon.`,
		type: NotificationTypeEnum.REMINDER,
	},
	[SessionStatusEnum.ONGOING]: {
		title: "📆 Session Ongoing",
		msg: (topic) => `Session "${topic}" is now ongoing.`,
		type: NotificationTypeEnum.INFO,
	},
};
