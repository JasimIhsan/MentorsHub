import axiosInstance from "./config/api.config";

export const fetchAllMentors = async () => {
	try {
		const response = await axiosInstance.get("/admin/mentor-application/all");
		return response.data;
	} catch (error: any) {
		console.log(`Error form fetchAllMentors api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const fetchAllApprovedMentors = async () => {
	try {
		const response = await axiosInstance.get("/user/mentor/approved");
		return response.data;
	} catch (error: any) {
		console.log(`Error form fetchMentors api : `, error);
		throw new Error(error.response.data.message);
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

export const updateSessionStatatusAPI = async ( sessionId: string, status: string) => {
	try {
		const response = await axiosInstance.put(`/mentor/sessions/${sessionId}/status`, { status });
		return response.data;
	} catch (error: any) {
		console.error("Error updating session status:", error);
		throw new Error(error.response.data.message);
	}
};
