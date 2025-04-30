// utility/is-session-expired.ts
export function isSessionExpired(date: string, time: string): boolean {
	try {
		// Parse the ISO date and extract the date part (YYYY-MM-DD)
		const sessionDate = new Date(date);
		const [year, month, day] = [sessionDate.getUTCFullYear(), sessionDate.getUTCMonth(), sessionDate.getUTCDate()];

		// Parse the time (HH:mm)
		const [hours, minutes] = time.split(":").map(Number);

		// Create a new Date object with the combined date and time in UTC
		const sessionDateTime = new Date(Date.UTC(year, month, day, hours, minutes));

		// Get the current date in UTC
		const currentDateTime = new Date();

		// Compare
		return sessionDateTime < currentDateTime;
	} catch (error) {
		console.error("Error parsing session date/time:", error);
		return false;
	}
}
