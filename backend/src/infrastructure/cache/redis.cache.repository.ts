import { createClient } from "redis";
import { ICacheRepository } from "../../domain/dbrepository/cache.respository";

export class RedisCacheRepository implements ICacheRepository {
	private client = createClient({ url: "redis://mentorshub_redis:6379" });
	constructor() {
		this.client.on("error", (err) => {
			console.error("Redis connected: ❌❌❌\n", err);
		});
		this.connectRedis();
		this.client.on("connect", () => console.log(" Redis connected    : ✅✅✅"));
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
		if(!data){
			console.warn(`Redis key "${key}" not found in cache`)
			return null 
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
