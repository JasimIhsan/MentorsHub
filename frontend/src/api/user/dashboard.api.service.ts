import axiosInstance from "../api.config";
import { Session, Mentor, Notification } from "@/interfaces/interfaces";

export const fetchDashboardDatas = async () => {
	try {
		const [sessionsRes, notificationsRes, mentorsRes] = await Promise.all([axiosInstance.get<Session[]>("/upcoming-sessions"), axiosInstance.get<Notification[]>("/notifications"), axiosInstance.get<Mentor[]>("/mentors-ready-now")]);
		return { sessions: sessionsRes.data, notifications: notificationsRes.data, mentors: mentorsRes.data };
	} catch (error) {
		console.error("Error fetching data:", error);
		if (error instanceof Error) {
			throw new Error("Failed to fetch dashboard data");
		}
	}
};
