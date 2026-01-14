import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertUTCtoLocal(startTime: string, endTime: string, date?: string): { date: string; startTime: string; endTime: string } {
	const localZone = "Asia/Kolkata";

	const toLocal = (time: string) => {
		const [hours, minutes] = time.split(":").map(Number);
		// Take date from server, set hours and minutes, then convert to local timezone
		const utcDate = dayjs
			.utc(date || "1970-01-01")
			.set("hour", hours)
			.set("minute", minutes)
			.set("second", 0)
			.set("millisecond", 0);
		return utcDate.tz(localZone);
	};

	const startLocal = toLocal(startTime);
	const endLocal = toLocal(endTime);

	return {
		date: startLocal.format("YYYY-MM-DD"), // Always in local timezone
		startTime: startLocal.format("HH:mm"),
		endTime: endLocal.format("HH:mm"),
	};
}
