import { createClient } from "redis";
import { ICacheRepository } from "../../domain/dbrepository/cache.respository";

export class RedisCacheRepository implements ICacheRepository {
	private client = createClient({ url: "redis://localhost:6379" });
	constructor() {
		this.client.on("error", (err) => {
			console.error("Redis connected: ❌\n", err);
		});
		this.client.on("connect", () => console.log("Redis connected: ✅"));
	}

	async getCachedData(key: string): Promise<string | null> {
		return await this.client.get(key);
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
