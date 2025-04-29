export const formatDate = (date: string) => {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

// Format time for display
export const formatTime = (time: string) => {
	const [hour, minute] = time.split(":").map(Number);
	const ampm = hour >= 12 ? "PM" : "AM";
	const hour12 = hour % 12 || 12;
	return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};
