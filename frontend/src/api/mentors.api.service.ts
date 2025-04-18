import axiosInstance from "./config/api.config";

export const fetchAllMentors = async () => {
	try {
		const response = await axiosInstance.get("/mentor/all");
		return response.data;
	} catch (error: any) {
		console.log(`Error form fetchAllMentors api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const fetchMentor = async (mentorId: string) => {
	try {
		const response = await axiosInstance.get(`/mentor/${mentorId}`);
		return response.data;
	} catch (error: any) {
		console.log(`Error from fetchMetor api`, error);
		throw new Error(error.response.data.message);
	}
};
