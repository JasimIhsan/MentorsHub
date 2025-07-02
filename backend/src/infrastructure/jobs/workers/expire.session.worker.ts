import { Worker } from "bullmq";
import { connection } from "../bullQueue";
import { ExpireOldSessions } from "../../../application/usecases/expire.old.sessions.usecase";
import { SessionRepositoryImpl } from "../../database/implementation/session.repository.impl";

const sessionRepo = new SessionRepositoryImpl();
const useCase = new ExpireOldSessions(sessionRepo);

export const sessionWorker = new Worker(
	"expireSessions",
	async () => {
		await useCase.execute();
		console.log("✅ Expired sessions updated");
	},
	{ connection },
);
