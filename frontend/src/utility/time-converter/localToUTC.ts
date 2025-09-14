import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertLocaltoUTC(
  startTime: string,
  endTime: string,
  date?: Date
): { date?: Date; startTime: string; endTime: string } {
  const istZone = "Asia/Kolkata"; // IST timezone

  // Helper function to convert local (IST) → UTC
  const toUTC = (time: string) => {
    const baseDate = date ? dayjs(date) : dayjs(); // use provided date or today
    const [hours, minutes] = time.split(":").map(Number);

    // Set IST time and convert to UTC
    return baseDate
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .tz(istZone)
      .utc();
  };

  const startUTC = toUTC(startTime);
  const endUTC = toUTC(endTime);

  return {
    date: date ? startUTC.toDate() : undefined,
    startTime: startUTC.format("HH:mm"),
    endTime: endUTC.format("HH:mm"),
  };
}
