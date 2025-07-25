// utils/sessionTimeCheck.ts

/**
 * Checks if user is allowed to join the session based on time.
 *
 * @param sessionDate - Date string from backend (e.g., "2025-07-28T00:00:00.000Z")
 * @param sessionTime - Time string (e.g., "18:00")
 * @param earlyJoinMinutes - Minutes before start time user can join (default: 5)
 * @returns { allowed: boolean, reason?: string }
 */
export function canJoinSessionNow(sessionDate: string, sessionTime: string, earlyJoinMinutes = 5): { allowed: boolean; reason?: string } {
	try {
		const sessionStart = new Date(sessionDate);
		const [hours, minutes] = sessionTime.split(":").map(Number);

		// Important: this sets time in **local time** (assumed to be IST)
		const sessionStartTime = new Date(sessionStart);
		sessionStartTime.setHours(hours, minutes, 0, 0); // Use setHours, not setUTCHours

		const joinAllowedTime = new Date(sessionStartTime.getTime() - earlyJoinMinutes * 60 * 1000);

		const now = new Date();

		if (now < joinAllowedTime) {
			return { allowed: false, reason: "Session has not started" };
		}

		return { allowed: true };
	} catch (err) {
		console.error("🛑 Session join time check failed:", err);
		return { allowed: false, reason: "Could not verify session time" };
	}
}
