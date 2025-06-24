// src/presentation/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../../infrastructure/utils/logger";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	logger.error(`${req.method} ${req.url} ❌ ${err.message || "Unknown Error"}`);

	res.status(err.status || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
}
