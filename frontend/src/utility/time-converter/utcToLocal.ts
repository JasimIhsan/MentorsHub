import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertUTCtoLocal(startTime: string, endTime: string, date?: Date): { date: string; startTime: string; endTime: string } {
	const localZone = "Asia/Kolkata";
	const toLocal = (time: string) => {
		const [hours, minutes] = time.split(":").map(Number);
		const utcDate = date ? dayjs.utc(date).hour(hours).minute(minutes).second(0).millisecond(0) : dayjs.utc("1970-01-01").hour(hours).minute(minutes);
		return utcDate.tz(localZone);
	};

	const startLocal = toLocal(startTime);
	const endLocal = toLocal(endTime);

	return {
		date: startLocal.format("YYYY-MM-DD"), // always string
		startTime: startLocal.format("HH:mm"),
		endTime: endLocal.format("HH:mm"),
	};
}
