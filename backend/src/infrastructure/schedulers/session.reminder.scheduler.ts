import cron from "node-cron";
import { SessionModel } from "../database/models/session/session.model";
import { SessionStatusEnum } from "../../application/interfaces/enums/session.status.enums";
import { getFullSessionDate } from "../utils/parse.session.date";
import { differenceInMinutes } from "date-fns";
import { notificationRepository, notifierGateway } from "../composer";
import { NotificationTypeEnum } from "../../application/interfaces/enums/notification.type.enum";
import { mapToNotificationDTO } from "../../application/dtos/notification.dto";
import { ReminderLogModel } from "../database/models/notification/reminder.logs.model";

export function startSessionReminderJob() {
	console.log("🟡 Cron Job: Session Reminder Job Initialized");

	cron.schedule("* * * * *", async () => {
		console.log("🔔 Cron Job Running: Checking session reminder (every minute)");
		const now = new Date();

		const sessions = await SessionModel.find({
			status: SessionStatusEnum.UPCOMING,
			"participants.paymentStatus": "completed",
		});

		const targetDiffs = [60, 10, 0];

		for (const session of sessions) {
			const messageMap: Record<number, string> = {
				60: `Your "${session.topic}"  session starts in 1 hour!`,
				10: `Only 10 minutes left until your "${session.topic}" session!`,
				0: `Your "${session.topic}" session is starting now!`,
			};

			const sessionDateTime = getFullSessionDate(session.date, session.time);

			const diff = differenceInMinutes(sessionDateTime, now);

			// Find nearest matching target diff (to account for slight timing drift)
			const matchedTarget = targetDiffs.find((target) => diff >= target - 1 && diff <= target);

			if (matchedTarget !== undefined) {
				const message = messageMap[matchedTarget];

				await Promise.all(
					session.participants.map(async (p) => {
						const userId = p.userId.toString();

						const alreadySent = await ReminderLogModel.exists({
							sessionId: session._id,
							userId,
							type: matchedTarget.toString(),
						});

						if (!alreadySent) {
							const notification = await notificationRepository.createNotification(userId, "🔔 Session Reminder", message, NotificationTypeEnum.REMINDER, "/sessions");

							notifierGateway.notifyUser(userId, mapToNotificationDTO(notification));

							await ReminderLogModel.create({
								sessionId: session._id,
								userId,
								type: matchedTarget.toString(),
							});
						}
					}),
				);
			}
		}
	});
}
