// export const formatRelativeTime = (date: Date | string) => {
// 	const dateObj = typeof date === "string" ? new Date(date) : date;
// 	if (isNaN(dateObj.getTime())) return "Unknown time";
// 	const now = new Date();
// 	const diff = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
// 	if (diff < 60) return "just now";
// 	const minutes = Math.floor(diff / 60);
// 	if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
// 	const hours = Math.floor(minutes / 60);
// 	if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
// 	const days = Math.floor(hours / 24);
// 	if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
// 	const months = Math.floor(days / 30);
// 	if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
// 	const years = Math.floor(months / 12);
// 	return `${years} year${years > 1 ? "s" : ""} ago`;
// };

import { formatDistanceToNow } from "date-fns";

export const formatRelativeTime = (date: Date | string) => {
	return formatDistanceToNow(new Date(date), { addSuffix: true });
};
