import axiosInstance from "./config/api.config";
import { fetchReviewsByMentor } from "./review.api.service";
import { fetchSessionsByMentor, fetchUpcomingSessionsByMentorAPI } from "./session.api.service";

export const fetchMentors = async (query: { page?: number; limit?: number; search?: string; status?: string }) => {
	try {
		const response = await axiosInstance.get("/admin/mentor-application/all", {
			params: query,
		});
		return response.data;
	} catch (error: any) {
		console.log(`Error from fetchAllMentors API: `, error);
		throw new Error(error.response.data.message);
	}
};

export const fetchAllApprovedMentors = async (userId: string, page: number = 1, limit: number = 6, search: string = "", sortBy: string = "recommended", priceMin?: number, priceMax?: number, interests?: string[]) => {
	try {
		const response = await axiosInstance.get(`/user/mentor/approved/${userId}`, {
			params: {
				page: page,
				limit: limit,
				search: search,
				sortBy: sortBy,
				priceMin: priceMin,
				priceMax: priceMax,
				interests: interests,
			},
		});
		return response.data;
	} catch (error: any) {
		// Log and throw error
		console.log(`Error from fetchMentors API: `, error);
		throw new Error(error.response?.data?.message || "Failed to fetch mentors");
	}
};

export const fetchMentorAPI = async (mentorId: string) => {
	try {
		const response = await axiosInstance.get(`./user/mentor/${mentorId}`);
		return response.data;
	} catch (error: any) {
		console.log(`Error from fetchMetor api`, error);
		throw new Error(error.response.data.message);
	}
};

export const fetchMentorAvailabilityAPI = async (mentorId: string, date: Date) => {
	try {
		const response = await axiosInstance.get(`/mentor/availability/${mentorId}?dateString=${date}`);
		return response.data;
	} catch (error: any) {
		console.error("Error fetching availability:", error);
		throw new Error(error.response.data.message);
	}
};

export const updateMentorStatusAPI = async (userId: string, status: "approved" | "rejected", rejectionReason?: string) => {
	try {
		const payload: {
			mentorRequestStatus: "approved" | "rejected";
			rejectionReason?: string;
		} = {
			mentorRequestStatus: status,
			rejectionReason: status === "rejected" ? rejectionReason || "No reason provided" : undefined,
		};
		const response = await axiosInstance.put(`/admin/mentor-application/${userId}/verify`, payload);
		return response.data;
	} catch (error: any) {
		console.error(`Error updating mentor status to ${status}:`, error);
		throw new Error(error.response.data.message);
	}
};

export const fetchMentorDashboardData = async (userId: string) => {
	try {
		const [upcomingRes, pendingRes, reviewsRes, statsRes] = await Promise.all([
			fetchUpcomingSessionsByMentorAPI(userId || "", "all", 1, 3, "upcoming"), //
			fetchSessionsByMentor(userId, "all", "pending", 1, 3),
			fetchReviewsByMentor(userId, 1, 3),
			axiosInstance.get(`/mentor/dashboard/stats/${userId}`),
		]);
		console.log(`pendingRes : `, pendingRes);
		return { 
			upcoming: upcomingRes.sessions, 
			requests: pendingRes.requests ,
			reviews: reviewsRes.reviews,
			stats: statsRes.data.stats
		};
	} catch (error: any) {
		console.error("Error fetching mentor dashboard data:", error);
		throw new Error(error.response.data.message);
	}
};
