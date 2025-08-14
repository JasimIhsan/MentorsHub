import jwt from "jsonwebtoken";
import { ITokenService, Payload } from "../../../application/interfaces/usecases/user/token.service.interface";
import { ICacheRepository } from "../../../domain/repositories/cache.respository";
import { TokenConfig } from "./config/jwt.config";
import dotenv from "dotenv";

dotenv.config();

export class TokenServicesImpl implements ITokenService {
	constructor(private redisService: ICacheRepository) {}

	generateAccessToken(userId: string, isAdmin: boolean = false): string {
		const payload = isAdmin ? { userId, isAdmin } : { userId };
		return jwt.sign(payload, TokenConfig.ACCESS_TOKEN_SECRET, { expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES!) });
	}

	generateRefreshToken(userId: string, isAdmin: boolean = false): string {
		const payload = isAdmin ? { userId, isAdmin } : { userId };
		return jwt.sign(payload, TokenConfig.REFRESH_TOKEN_SECRET, { expiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES!) });
	}

	validateAccessToken(token: string): Payload | null {
		try {
			return jwt.verify(token, TokenConfig.ACCESS_TOKEN_SECRET) as Payload;
		} catch (error) {
			throw error;
		}
	}

	validateRefreshToken(token: string): Payload | null {
		try {
			return jwt.verify(token, TokenConfig.REFRESH_TOKEN_SECRET) as Payload;
		} catch (error) {
			throw error;
		}
	}

	async isTokenBlacklisted(token: string): Promise<boolean> {
		const result = await this.redisService.getCachedData(`bl_${token}`);
		return !!result;
	}

	async blacklistToken(token: string, expirySeconds: number): Promise<void> {
		await this.redisService.setCachedData(`bl_${token}`, "blacklisted", expirySeconds);
	}
}
