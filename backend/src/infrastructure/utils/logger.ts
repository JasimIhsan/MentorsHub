import { createLogger, format, transports } from "winston";

// ✅ Custom filter to ignore 'http' logs in console
const ignoreHttpLogs = format((info) => {
	if (info.level === "http") {
		return false; // don't log http to console
	}
	return info;
});

export const logger = createLogger({
	level: "http",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf(({ timestamp, level, message }) => {
			return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		}),
	),
	transports: [
		// ✅ Console will skip http logs
		new transports.Console({
			format: format.combine(ignoreHttpLogs(), format.colorize(), format.simple()),
		}),
		// ✅ These will include http logs
		new transports.File({ filename: "logs/error.log", level: "error" }),
		new transports.File({ filename: "logs/http.log", level: "http" }),
		new transports.File({ filename: "logs/combined.log" }),
	],
});
