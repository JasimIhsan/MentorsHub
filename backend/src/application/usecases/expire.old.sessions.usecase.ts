// import { ISessionRepository } from "../../domain/repositories/session.repository";

// export class ExpireOldSessions {
// 	constructor(private sessionRepo: ISessionRepository) {}

// 	async execute(): Promise<void> {
// 		const sessions = await this.sessionRepo.getExpirableSessions();
// 		const now = new Date();

// 		for (const session of sessions) {
// 			const start = new Date(session.date);
// 			const [h, m] = session.time.split(":");
// 			start.setHours(Number(h), Number(m));

// 			const end = new Date(start.getTime() + session.hours * 60 * 60 * 1000);

// 			if (now > end) {
// 				await this.sessionRepo.(session._id.toString());
// 			}
// 		}
// 	}
// }
