import { NextFunction, Request, Response } from "express";
import { logger } from "../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
	console.log(`IN ERROR HANDLER MIDDLEWARE`);
	logger.error(`${req.method} ${req.url} ❌ ${err.message || "Unknown Error"}`);

	if (err instanceof Error) {
		console.log(`err is instance of Error : `, err.message);
		res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: err.message });
	} else {
		console.log(`err is not instance of Error : `, err);
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Something went wrong" });
	}
}
