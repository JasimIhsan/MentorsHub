import { createClient } from "redis";
import { ICacheRepository } from "../../domain/repositories/cache.respository";
import { logger } from "../utils/logger";

export class RedisCacheRepository implements ICacheRepository {
	private client = createClient({ url: process.env.REDIS_URL as string });
	constructor() {
		this.client.on("error", (err) => {
			logger.error(`Redis connection error ❌❌❌: ${err.message}`);
		});
		this.connectRedis();
		this.client.on("connect", () => logger.info(" Redis connected    : ✅✅✅"));
	}

	private async connectRedis() {
		try {
			await this.client.connect();
		} catch (err) {
			console.error("Failed to connect to Redis:", err);
		}
	}

	async getCachedData(key: string): Promise<string | null> {
		const data = await this.client.get(key);
		if (!data) {
			console.warn(`Redis key "${key}" not found in cache`);
			return null;
		}
		return data.toString();
	}

	async setCachedData(key: string, value: string, expiry: number): Promise<void> {
		await this.client.set(key, value, {
			EX: expiry,
		});
	}

	async removeCachedData(key: string): Promise<void> {
		await this.client.del(key);
	}
}
