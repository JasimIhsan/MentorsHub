import axiosInstance from "./config/api.config";

export async function requestSessionRescheduleAPI(
	sessionId: string,
	data: {
		userId: string;
		date: string;
		startTime: string;
		endTime: string;
		message: string;
	}
) {
	try {
		const response = await axiosInstance.post(`/user/reschedule/create/${sessionId}`, data);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message || "Failed to reschedule session.");
	}
}

export async function fetchRescheduleRequestsByMentor(mentorId: string, page: number, limit: number, status: string) {
	try {
		const response = await axiosInstance.get(`/mentor/reschedule/${mentorId}/reschedule-requests`, {
			params: {
				page,
				limit,
				status,
			},
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message || "Failed to fetch reschedule requests.");
	}
}

export const counterProposeRescheduleAPI = async (userId: string, sessionId: string, startTime: string, endTime: string, message: string, date: Date) => {
	try {
		const response = await axiosInstance.put(`/user/reschedule/counter/${userId}/${sessionId}`, { startTime, endTime, message, date });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message || "Failed to counter propose reschedule.");
	}
};

export const acceptProposalRescheduleAPI = async (userId: string, sessionId: string, isCounterProposal: boolean) => {
	try {
		const response = await axiosInstance.put(`/user/reschedule/accept/${userId}/${sessionId}`, {
			isCounter: isCounterProposal,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message || "Failed to accept reschedule proposal.");
	}
};
