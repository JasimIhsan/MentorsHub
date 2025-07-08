import { JwtPayload } from "jsonwebtoken";

export interface Payload extends JwtPayload {
	userId: string;
	isAdmin?: boolean;
}
export interface ITokenService {
	generateAccessToken(id: string, isAdmin?: boolean): string;
	validateAccessToken(token: string): string | Payload | null;
	generateRefreshToken(id: string, isAdmin?: boolean): string;
	validateRefreshToken(token: string): string | Payload | null;
	isTokenBlacklisted(token: string): Promise<boolean>;
	blacklistToken(token: string, expirySeconds: number): Promise<void>;
}
