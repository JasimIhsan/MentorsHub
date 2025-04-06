import { JwtPayload } from "jsonwebtoken";

export type UserStatus = "blocked" | "unblocked";
export interface Payload extends JwtPayload {
	userId: string;
	isAdmin?: boolean;
}
export interface ITokenService {
	generateAccessToken(id: string, isAdmin?: boolean): string;
	validateAccessToken(token: string): string | Payload | null;
	generateRefreshToken(id: string, isAdmin?: boolean): string;
	validateRefreshToken(token: string): string | Payload | null;
}
