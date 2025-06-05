import { NotificationType } from "@/interfaces/INotification";
import axiosInstance from "./config/api.config";

export const createNotificationAPI = async (userId: string, title: string, message: string, type: NotificationType) => {
	try {
		const res = await axiosInstance.post("/notifications", {
			userId,
			title,
			message,
			type,
		});
		return res.data.data;
	} catch (error) {
		console.error("Error creating notification:", error);
		throw error;
	}
};

export const getUserNotificationsAPI = async ({ userId, page = 1, limit = 10, search = "", isRead }: { userId: string; page?: number; limit?: number; search?: string; isRead?: boolean }) => {
	try {
		const res = await axiosInstance.get(`/notifications/${userId}`, {
			params: {
				page,
				limit,
				search,
				isRead,
			},
		});
		console.log(`Response from getUserNotificationsAPI : `, res);
		return res.data;
	} catch (error) {
		console.error("Error fetching notifications:", error);
		throw error;
	}
};

export const markNotificationAsReadAPI = async (notificationId: string) => {
	try {
		await axiosInstance.patch(`/notifications/read/${notificationId}`);
	} catch (error) {
		console.error("Error marking notification as read:", error);
		throw error;
	}
};

export const markAllNotificationsAsReadAPI = async (userId: string) => {
	try {
		await axiosInstance.patch(`/notifications/read-all/${userId}`);
	} catch (error) {
		console.error("Error marking all notifications as read:", error);
		throw error;
	}
};
