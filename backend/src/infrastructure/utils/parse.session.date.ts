import { fromZonedTime } from "date-fns-tz";

export function getFullSessionDate(date: Date, time: string): Date {
	console.log('time: ', time);
	console.log('date: ', date);
	const [hours, minutes] = time.split(":").map(Number);
	console.log(`Time : ${hours}:${minutes}`, );

	const dateStr = date.toISOString().split("T")[0]; // e.g. "2025-07-16"
	const fullLocalTime = `${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

	const utcTime = fromZonedTime(fullLocalTime, "Asia/Kolkata");
	console.log(" utcTime: ", utcTime);

	// Converts IST time string to correct UTC Date
	return utcTime;
}
