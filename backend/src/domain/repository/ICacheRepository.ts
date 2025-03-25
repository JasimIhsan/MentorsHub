export interface ICacheRepository {
	getCachedData(key: string): Promise<string | null>;
	setCachedData(key: string, value: string, expiry: number): Promise<void>;
	removeCachedData(key: string): Promise<void>;
}