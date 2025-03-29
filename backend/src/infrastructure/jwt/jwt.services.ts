import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { ITokenService } from "../../application/providers/token.service.interface";
dotenv.config();

const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN as string;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN as string;

if (!JWT_ACCESS_TOKEN || !JWT_REFRESH_TOKEN) {
	throw new Error("JWT secret keys are missing in .env file!");
}

export class TokenServicesImpl implements ITokenService {
	generateAccessToken(userId: string): string {
		return jwt.sign({userId}, JWT_ACCESS_TOKEN, { expiresIn: "5m" });
	}

	generateRefreshToken(userId: string): string {
		return jwt.sign({userId}, JWT_REFRESH_TOKEN, { expiresIn: "15m" });
	}

	validateAccessToken(token: string): string | JwtPayload | null {
		try {
			return jwt.verify(token, JWT_ACCESS_TOKEN);
		} catch (error) {
			return null;
		}
	}

	validateRefreshToken(token: string): JwtPayload | null {
		try {
			return jwt.verify(token, JWT_REFRESH_TOKEN) as JwtPayload;
		} catch (error) {
			return null;
		}
	}
}
