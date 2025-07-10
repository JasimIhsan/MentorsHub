import cron from "node-cron";
import { SessionStatusEnum } from "../../application/interfaces/enums/session.status.enums";
import { SessionRepositoryImpl } from "../database/implementation/session.repository.impl";

export const startSessionExpiryJob = () => {
	console.log("🟢 Cron Job: Session Expiry Job Initialized");

	// Runs every 10 seconds:  "sec  min  hr  day  mon  dow"
	cron.schedule("*/15 * * * *", async () => {
		console.log("⏰ Cron Job Running: Checking for expirable sessions (every 10 s)");

		const repo = new SessionRepositoryImpl();
		const sessions = await repo.getExpirableSessions();

		for (const session of sessions) {
			await repo.updateStatus(session.id.toString(), SessionStatusEnum.EXPIRED);
			console.log(`🔴 Session ${session.id} marked as expired`);
		}
	});
};
