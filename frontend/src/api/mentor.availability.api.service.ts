import axiosInstance from "./config/api.config";

export const fetchWeeklySlotsAPI = async (mentorId: string) => {
	try {
		const response = await axiosInstance.get(`/mentor/availability/weekly/${mentorId}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

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

export const toggleWeeklySlotActiveAPI = async (mentorId: string, slotId: string) => {
	try {
		const response = await axiosInstance.patch(`/mentor/availability/toggle-active/${mentorId}/${slotId}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const toggleWeeklySlotByWeekDayAPI = async (mentorId: string, day: number, status: boolean) => {
	try {
		const response = await axiosInstance.patch(`/mentor/availability/toggle-weekday/${mentorId}`, {
			dayOfWeek: day,
			status,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

//========================== DATE-SPECIFIC SLOTS ==========================

export const fetchDateSlotsAPI = async (mentorId: string) => {
	try {
		const response = await axiosInstance.get(`/mentor/availability/special/${mentorId}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const addDateSlotAPI = async (mentorId: string, slot: { date: string; startTime: string; endTime: string;}) => {
	try {
		const response = await axiosInstance.post(`/mentor/availability/special/create/${mentorId}`, slot);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const deleteDateSlotAPI = async (mentorId: string, slotId: string) => {
	try {
		const response = await axiosInstance.delete(`/mentor/availability/special/${mentorId}/${slotId}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const updateDateSlotAPI = async (mentorId: string, slotId: string, startTime: string, endTime: string) => {
	try {
		const response = await axiosInstance.put(`/mentor/availability/special/update/${mentorId}/${slotId}`, { startTime, endTime });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};
