import axiosInstance from "./config/api.config";

export const addWeeklySlotAPI = async (mentorId: string, slot: { day: string; startTime: string; endTime: string }) => {
	try {
		const response = await axiosInstance.post(`/mentor/availability/create/${mentorId}`, {
			day: slot.day,
			startTime: slot.startTime,
			endTime: slot.endTime,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const deleteWeeklySlotAPI = async (mentorId: string, slotId: string) => {
	try {
		const response = await axiosInstance.delete(`/mentor/availability/${mentorId}/${slotId}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const updateWeeklySlotAPI = async (mentorId: string, slotId: string, startTime: string, endTime: string) => {
	try {
		const response = await axiosInstance.put(`/mentor/availability/update/${mentorId}/${slotId}`, { startTime, endTime });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};
