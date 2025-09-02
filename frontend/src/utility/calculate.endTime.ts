export const calculateEndTime = (startTime: string, hours: number): string => {
	const [startHours, minutes] = startTime.split(":").map(Number);
	let newHours = startHours + hours;
	const newMinutes = minutes;

	// Handle hour overflow
	if (newHours >= 24) {
		newHours = newHours % 24;
	}

	// Ensure proper formatting with leading zeros
	return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
};
