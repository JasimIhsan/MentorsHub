export function isSessionExpired(date: Date, time: string): boolean {
	const sessionDateTime = new Date(`${date.toISOString().split("T")[0]}T${time}`);
	return sessionDateTime < new Date();
}
