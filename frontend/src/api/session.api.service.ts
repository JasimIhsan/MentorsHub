import axiosInstance from "./config/api.config";

export const fetchSessionsByMentor = async (userId: string, filterOption: string, activeTab: string, page: number, limit: number) => {
	try {
		const response = await axiosInstance.get(`/mentor/sessions/${userId}/requests`, {
			params: {
				dateRange: filterOption,
				status: activeTab,
				page,
				limit,
			},
		});
		return response.data;
	} catch (error: any) {
		console.error("Error fetching sessions by mentor:", error);
		throw new Error(error.response.data.message);
	}
};

export const updateSessionStatatusAPI = async (sessionId: string, status: string, reason?: string) => {
	console.log("reason: ", reason);
	try {
		const response = await axiosInstance.put(`/mentor/sessions/${sessionId}/status`, { status, reason });
		return response.data;
	} catch (error: any) {
		console.error("Error updating session status:", error);
		throw new Error(error.response.data.message);
	}
};

export const fetchUpcomingSessionsByMentorAPI = async (userId: string, filterOption: string, page: number, limit: number, status: string) => {
	try {
		const response = await axiosInstance.get(`/mentor/sessions/${userId}/upcoming`, {
			params: {
				filterOption,
				page,
				limit,
				status,
			},
		});
		return response.data;
	} catch (error: any) {
		console.error("Error fetching upcoming sessions by mentor:", error);
		throw new Error(error.response.data.message);
	}
};

export const fetchSessionHistoryAPI = async (mentorId: string, status: string, page: number, limit: number, sort?: string) => {
	try {
		const response = await axiosInstance.get(`/mentor/sessions/${mentorId}/session-history`, { params: { status, page, limit, sort } });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Failed to load session history.");
	}
};

export const createRazorpayOrderAPI = async (sessionId: string, userId: string) => {
	try {
		const res = await axiosInstance.post("/user/sessions/create-payment-order", {
			sessionId,
			userId,
		});
		return res.data.order;
	} catch (error: any) {
		console.error(`Error from createRazorpayOrderAPI : `, error);
		throw new Error(error.response?.data?.message || "Failed to create Razorpay order.");
	}
};

export const verifySessionPaymentAPI = async (sessionId: string, userId: string) => {
	try {
		const res = await axiosInstance.get("/user/sessions/verify-payment", {
			params: { sessionId, userId },
		});
		return res.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Failed to verify session payment.");
	}
};

export const fetchSessionsByUser = async (userId: string, page: number, limit: number, status?: string) => {
	try {
		const res = await axiosInstance.get(`/user/sessions/${userId}`, {
			params: { page, limit, status },
		});
		return res.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Failed to fetch user sessions.");
	}
};

export const fetchSessionByUser = async (userId: string, sessionId: string) => {
	try {
		const res = await axiosInstance.get(`/user/sessions/${userId}/${sessionId}`);
		return res.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Failed to fetch user sessions.");
	}
};

export const cancelSessionAPI = async (userId: string, sessionId: string) => {
	try {
		const res = await axiosInstance.put(`/user/sessions/cancel-session`, { userId, sessionId });
		return res.data;
	} catch (error: any) {
		throw new Error(error.response?.data?.message || "Failed to cancel session.");
	}
};
