import { fromZonedTime } from "date-fns-tz";

export function getFullSessionDate(date: Date, time: string): Date {
	const [hours, minutes] = time.split(":").map(Number);
	const dateStr = date.toISOString().split("T")[0]; // e.g. "2025-07-16"
	const fullLocalTime = `${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
	const utcTime = fromZonedTime(fullLocalTime, "Asia/Kolkata");
	// Converts IST time string to correct UTC Date
	return utcTime;
}
