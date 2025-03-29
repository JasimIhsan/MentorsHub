import { JwtPayload } from "jsonwebtoken";

export interface ITokenService {
	generateAccessToken(id: string): string;
	validateAccessToken(token: string):  string | JwtPayload | null;
	generateRefreshToken(id: string): string;
	validateRefreshToken(token: string): string | JwtPayload | null;
}
