import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UserInterface } from "../domain/entities/user.entity";

declare module "express-serve-static-core" {
	interface Request {
		user?: string | JwtPayload;
	}
}

export class AuthenticatedRequest extends Request {
	user?: string | JwtPayload | UserInterface;
}
