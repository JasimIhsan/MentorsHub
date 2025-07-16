import { Router } from "express";
import { signupController, signinController, refreshController, forgotPasswordController, verifyResetTokenController, resetPasswordController, logoutController, sendOtpController } from "../../controllers/user/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { verifyRefreshToken } from "../../middlewares/auth.refresh.token.middleware";
import { checkUserStatusInLogin } from "../../middlewares/auth.user.status.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";
import { notificationRepository, notifierGateway } from "../../../infrastructure/composer";
import { differenceInMinutes } from "date-fns";
import { mapToNotificationDTO } from "../../../application/dtos/notification.dto";
import { NotificationTypeEnum } from "../../../application/interfaces/enums/notification.type.enum";
import { SessionStatusEnum } from "../../../application/interfaces/enums/session.status.enums";
import { ReminderLogModel } from "../../../infrastructure/database/models/notification/reminder.logs.model";
import { SessionModel } from "../../../infrastructure/database/models/session/session.model";
import { getFullSessionDate } from "../../../infrastructure/utils/parse.session.date";

const authRouter = Router();

// Authentication Routes
authRouter.post("/register", (req, res, next) => signupController.handle(req, res, next));

authRouter.post("/login", checkUserStatusInLogin, (req, res, next) => signinController.handle(req, res, next));

authRouter.post("/refresh-token", verifyRefreshToken, (req, res, next) => refreshController.handle(req, res, next));

authRouter.post("/forgot-password", checkUserStatusInLogin, (req, res, next) => forgotPasswordController.handle(req, res, next));

authRouter.get("/verify-reset-token/:token", (req, res, next) => verifyResetTokenController.handle(req, res, next));

authRouter.post("/reset-password", (req, res, next) => resetPasswordController.handle(req, res, next));

authRouter.post("/logout", (req, res, next) => logoutController.handle(req, res, next));

authRouter.post("/send-otp", (req, res, next) => sendOtpController.handle(req, res, next));

authRouter.post("/resend-otp", (req, res, next) => sendOtpController.handle(req, res, next));

// Test Route
authRouter.get("/test", verifyAccessToken, requireRole(RoleEnum.MENTOR, RoleEnum.USER), (req, res) => {
	async function runSessionReminderCheck() {
		console.log("running remninder check");
		const now = new Date();

		const sessions = await SessionModel.find({
			status: SessionStatusEnum.UPCOMING,
			"participants.paymentStatus": "completed",
		});
		console.log("sessions: ", sessions);

		for (const session of sessions) {
			const sessionDateTime = getFullSessionDate(session.date, session.time);
			console.log("sessionDateTime: ", sessionDateTime);
			const diff = differenceInMinutes(sessionDateTime, now);
			console.log("diff: ", diff);

			if ([60, 10, 0].includes(diff)) {
				const messageMap: Record<number, string> = {
					60: "Your session starts in 1 hour!",
					10: "Only 10 minutes left until your session!",
					0: "Your session is starting now!",
				};

				await Promise.all(
					session.participants.map(async (p) => {
						const userId = p.userId.toString();

						const alreadySent = await ReminderLogModel.exists({
							sessionId: session._id,
							userId,
							type: diff.toString(),
						});
						console.log("alreadySent: ", alreadySent);

						if (!alreadySent) {
							const notification = await notificationRepository.createNotification(userId, "Session Reminder", messageMap[diff], NotificationTypeEnum.REMINDER, "/sessions");
							console.log("notification: ", notification);

							notifierGateway.notifyUser(userId, mapToNotificationDTO(notification));

							await ReminderLogModel.create({
								sessionId: session._id,
								userId,
								type: diff.toString(),
							});
						}
					}),
				);
			}
		}
	}
	runSessionReminderCheck();
	res.json({ success: true, message: "Hello, authenticated user!" });
});

export default authRouter;
