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
	try {
		const response = await axiosInstance.put(`/mentor/sessions/${sessionId}/status`, { status, reason });
		return response.data;
	} catch (error: any) {
		console.error("Error updating session status:", error);
		throw new Error(error.response.data.message);
	}
};