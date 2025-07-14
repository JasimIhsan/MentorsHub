export const formatDate = (date: string) => {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

// Format time for display
export const formatTime = (time: string | Date) => {
	let dateObj: Date;

	if (typeof time === "string") {
		// if it's just time like "09:00"
		if (/^\d{2}:\d{2}$/.test(time)) {
			dateObj = new Date(`1970-01-01T${time}:00`);
		} else {
			dateObj = new Date(time);
		}
	} else {
		dateObj = time;
	}

	if (isNaN(dateObj.getTime())) {
		return "Invalid Time";
	}

	const hour = dateObj.getHours();
	const minute = dateObj.getMinutes();
	const ampm = hour >= 12 ? "PM" : "AM";
	const hour12 = hour % 12 || 12;
	
	return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};
