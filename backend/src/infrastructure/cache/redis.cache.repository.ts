import { createClient, RedisClientType } from "redis";
import { ICacheRepository } from "../../domain/repositories/cache.respository";
import { logger } from "../utils/logger";

export class RedisCacheRepository implements ICacheRepository {
	private client: RedisClientType;

	constructor() {
		this.client = createClient({
			username: process.env.REDIS_USERNAME,
			password: process.env.REDIS_PASSWORD,
			socket: {
				host: process.env.REDIS_HOST,
				port: Number(process.env.REDIS_PORT),
			},
		});

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
