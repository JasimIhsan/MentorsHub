<<<<<<< HEAD
import { Express } from "express";

import authRouter from "./presentation/routes/user/auth.routes";
import { googleAuthRouter } from "./presentation/routes/user/google.auth.routes";
import { adminAuthRouter } from "./presentation/routes/admin/admin.auth.routes";
import { usertabRouter } from "./presentation/routes/admin/admin.usertab.routes";
import { userProfileRoutes } from "./presentation/routes/user/user.profile.routes";
import { mentorRouter } from "./presentation/routes/user/mentor.routes";
import { mentorApplicationRouter } from "./presentation/routes/admin/admin.mentor.application.routes";
import { sessionRouter } from "./presentation/routes/user/session.routes";
import { userSideMentorRouter } from "./presentation/routes/user/user.side.mentor.routes";
import { documentsRouter } from "./presentation/routes/common/documents.routes";
import { mentorSessionRouter } from "./presentation/routes/mentors/mentor.session.routes";
import { notificationRouter } from "./presentation/routes/common/notification.routes";
import { reviewRouter } from "./presentation/routes/user/review.routes";
import { userWalletRouter } from "./presentation/routes/user/wallet.routes";
import { adminWalletRouter } from "./presentation/routes/admin/admin.wallet.routes";
import { messageRouter } from "./presentation/routes/user/message.routes";
import { adminGamificationTaskRouter } from "./presentation/routes/admin/admin.gamification.task.routes";
import { gamificationRoute } from "./presentation/routes/user/gamification.routes";
import { mentorDashboardRoutes } from "./presentation/routes/mentors/mentor.dashboard.routes";
import { adminDashboardRouter } from "./presentation/routes/admin/admin.dashboard.routes";
import { userReportRouter } from "./presentation/routes/user/report.routes";
import { adminReportRouter } from "./presentation/routes/admin/admin.reports.routes";
import { mentorProfileRouter } from "./presentation/routes/mentors/mentor.profile.routes";
import { mentorAvailabilityRouter } from "./presentation/routes/mentors/mentor.availability.routes";
import { rescheduleRouter } from "./presentation/routes/user/reschedule.routes";
import { mentorRescheduleRouter } from "./presentation/routes/mentors/mentor.reschedule.routes";
import { withdrawalRouter } from "./presentation/routes/user/withdrawal.routes";
import { adminWithdrawalRequestsRouter } from "./presentation/routes/admin/admin.withdrawal.requests.routes";

export function registerRoutes(app: Express) {
	app.use("/api/user", authRouter);
	app.use("/api/user/auth", googleAuthRouter);
	app.use("/api/user/user-profile", userProfileRoutes);
	app.use("/api/user/sessions", sessionRouter);
	app.use("/api/user/mentor", userSideMentorRouter);
	app.use("/api/user/reviews", reviewRouter);
	app.use("/api/user/wallet", userWalletRouter);
	app.use("/api/user/messages", messageRouter);
	app.use("/api/user/gamification", gamificationRoute);
	app.use("/api/user/reports", userReportRouter);
	app.use("/api/user/reschedule", rescheduleRouter);
	app.use("/api/user/withdrawal", withdrawalRouter);

	app.use("/api/admin", adminAuthRouter);
	app.use("/api/admin/users", usertabRouter);
	app.use("/api/admin/mentor-application", mentorApplicationRouter);
	app.use("/api/admin/wallet", adminWalletRouter);
	app.use("/api/admin/gamification", adminGamificationTaskRouter);
	app.use("/api/admin/dashboard", adminDashboardRouter);
	app.use("/api/admin/reports", adminReportRouter);
	app.use("/api/admin/withdrawal", adminWithdrawalRequestsRouter);

	app.use("/api/mentor", mentorRouter);
	app.use("/api/mentor/sessions", mentorSessionRouter);
	app.use("/api/mentor/dashboard", mentorDashboardRoutes);
	app.use("/api/mentor/profile", mentorProfileRouter);
	app.use("/api/mentor/availability", mentorAvailabilityRouter);
	app.use("/api/mentor/reschedule", mentorRescheduleRouter);

	app.use("/api/documents", documentsRouter);
	app.use("/api/notifications", notificationRouter);
}
=======
import { Express } from "express";

import authRouter from "./presentation/routes/user/auth.routes";
import { googleAuthRouter } from "./presentation/routes/user/google.auth.routes";
import { adminAuthRouter } from "./presentation/routes/admin/admin.auth.routes";
import { usertabRouter } from "./presentation/routes/admin/admin.usertab.routes";
import { userProfileRoutes } from "./presentation/routes/user/user.profile.routes";
import { mentorRouter } from "./presentation/routes/user/mentor.routes";
import { mentorApplicationRouter } from "./presentation/routes/admin/admin.mentor.application.routes";
import { sessionRouter } from "./presentation/routes/user/session.routes";
import { userSideMentorRouter } from "./presentation/routes/user/user.side.mentor.routes";
import { documentsRouter } from "./presentation/routes/common/documents.routes";
import { mentorSessionRouter } from "./presentation/routes/mentors/mentor.session.routes";
import { notificationRouter } from "./presentation/routes/common/notification.routes";
import { reviewRouter } from "./presentation/routes/user/review.routes";
import { userWalletRouter } from "./presentation/routes/user/wallet.routes";
import { adminWalletRouter } from "./presentation/routes/admin/admin.wallet.routes";
import { messageRouter } from "./presentation/routes/user/message.routes";
import { adminGamificationTaskRouter } from "./presentation/routes/admin/admin.gamification.task.routes";
import { gamificationRoute } from "./presentation/routes/user/gamification.routes";
import { mentorDashboardRoutes } from "./presentation/routes/mentors/mentor.dashboard.routes";
import { adminDashboardRouter } from "./presentation/routes/admin/admin.dashboard.routes";
import { userReportRouter } from "./presentation/routes/user/report.routes";
import { adminReportRouter } from "./presentation/routes/admin/admin.reports.routes";
import { mentorProfileRouter } from "./presentation/routes/mentors/mentor.profile.routes";
import { mentorAvailabilityRouter } from "./presentation/routes/mentors/mentor.availability.routes";
import { rescheduleRouter } from "./presentation/routes/user/reschedule.routes";
import { mentorRescheduleRouter } from "./presentation/routes/mentors/mentor.reschedule.routes";
import { withdrawalRouter } from "./presentation/routes/user/withdrawal.routes";
import { adminWithdrawalRequestsRouter } from "./presentation/routes/admin/admin.withdrawal.requests.routes";
import { mentorAvailabilityToUserRouter } from "./presentation/routes/user/mentor.availability.routes";

export function registerRoutes(app: Express) {
	app.use("/api/user", authRouter);
	app.use("/api/user/auth", googleAuthRouter);
	app.use("/api/user/user-profile", userProfileRoutes);
	app.use("/api/user/sessions", sessionRouter);
	app.use("/api/user/mentor", userSideMentorRouter);
	app.use("/api/user/reviews", reviewRouter);
	app.use("/api/user/wallet", userWalletRouter);
	app.use("/api/user/messages", messageRouter);
	app.use("/api/user/gamification", gamificationRoute);
	app.use("/api/user/reports", userReportRouter);
	app.use("/api/user/reschedule", rescheduleRouter);
	app.use("/api/user/withdrawal", withdrawalRouter);
	app.use("/api/user/mentor-availability", mentorAvailabilityToUserRouter);

	app.use("/api/admin", adminAuthRouter);
	app.use("/api/admin/users", usertabRouter);
	app.use("/api/admin/mentor-application", mentorApplicationRouter);
	app.use("/api/admin/wallet", adminWalletRouter);
	app.use("/api/admin/gamification", adminGamificationTaskRouter);
	app.use("/api/admin/dashboard", adminDashboardRouter);
	app.use("/api/admin/reports", adminReportRouter);
	app.use("/api/admin/withdrawal", adminWithdrawalRequestsRouter);

	app.use("/api/mentor", mentorRouter);
	app.use("/api/mentor/sessions", mentorSessionRouter);
	app.use("/api/mentor/dashboard", mentorDashboardRoutes);
	app.use("/api/mentor/profile", mentorProfileRouter);
	app.use("/api/mentor/availability", mentorAvailabilityRouter);
	app.use("/api/mentor/reschedule", mentorRescheduleRouter);

	app.use("/api/documents", documentsRouter);
	app.use("/api/notifications", notificationRouter);
}
>>>>>>> refractor/code-cleanup
