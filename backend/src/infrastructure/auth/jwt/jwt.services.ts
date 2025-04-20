import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenService, Payload } from "../../../application/interfaces/user/token.service.interface";

dotenv.config();

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN as string;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN as string;

if (!JWT_ACCESS_TOKEN || !JWT_REFRESH_TOKEN) {
	throw new Error("JWT secret keys are missing in .env file!");
}

export class TokenServicesImpl implements ITokenService {
	generateAccessToken(userId: string, isAdmin: boolean = false): string {
		if (isAdmin) {
			return jwt.sign({ userId, isAdmin }, JWT_ACCESS_TOKEN, { expiresIn: "5m" });
		}
		return jwt.sign({ userId }, JWT_ACCESS_TOKEN, { expiresIn: "5m" });
	}

	generateRefreshToken(userId: string, isAdmin: boolean = false): string {
		if (isAdmin) {
			return jwt.sign({ userId, isAdmin }, JWT_REFRESH_TOKEN, { expiresIn: "1h" });
		}
		return jwt.sign({ userId }, JWT_REFRESH_TOKEN, { expiresIn: "1h" });
	}

	validateAccessToken(token: string): Payload | null {
		try {
			return jwt.verify(token, JWT_ACCESS_TOKEN) as Payload;
		} catch (error) {
			return null;
		}
	}

	validateRefreshToken(token: string): Payload | null {
		try {
			return jwt.verify(token, JWT_REFRESH_TOKEN) as Payload;
		} catch (error) {
			return null;
		}
	}
}
