import { Queue } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis();
export const sessionQueue = new Queue("expireSessions", { connection });

// Run every 5 min
setInterval(() => {
	sessionQueue.add("checkExpired", {});
}, 5 * 60 * 1000);
