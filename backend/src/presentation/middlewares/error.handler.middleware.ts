// src/presentation/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../../infrastructure/utils/logger";
import { HttpStatusCode } from "../../shared/constants/http.status.codes";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	logger.error(`${req.method} ${req.url} ❌ ${err.message || "Unknown Error"}`);

	if (err instanceof Error) {
		res.status(HttpStatusCode.BAD_REQUEST).json({ success: false, message: err.message });
	} else {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Something went wrong" });
	}
}
