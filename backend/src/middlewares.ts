import { Express } from "express";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { logger } from "./infrastructure/utils/logger";

export function applyGlobalMiddlewares(app: Express) {
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ extended: true, limit: "10mb" }));
	app.use(cookieParser());
	app.use(helmet());
	app.use(
		cors({
			origin: [process.env.FRONTEND_ORIGIN_DEV!, process.env.FRONTEND_ORIGIN_PROD!],
			methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
			credentials: true,
		}),
	);

	app.use(morgan("dev"));
	app.use(
		morgan(":method :url :status :res[content-length] - :response-time ms", {
			stream: { write: (msg) => logger.http(msg.trim()) },
		}),
	);
}
