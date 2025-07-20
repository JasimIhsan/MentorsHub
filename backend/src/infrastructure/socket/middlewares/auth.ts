// middlewares/auth.ts
import { Socket } from "socket.io";
// import jwt from "jsonwebtoken";
// import { verifyAccessToken } from "../../../presentation/middlewares/auth.access.token.middleware";
// import { TokenConfig } from "../../auth/jwt/config/jwt.config";

export function authMiddleware(socket: Socket, next: (err?: any) => void) {
	const token = socket.handshake.auth?.token;
	try {
		// const payload = jwt.verify(token, TokenConfig.ACCESS_TOKEN_SECRET!) as { sub: string };
		// console.log('payload: ', payload);
		const userId = socket.handshake.auth?.userId;
		if (!userId) return next(new Error("Unauthorised"));
		socket.data.userId = userId;
		next();
	} catch {
		next(new Error("Unauthorised"));
	}
}
