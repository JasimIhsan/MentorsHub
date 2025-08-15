import axiosInstance from "./config/api.config";

export const fetchReviewsByMentor = async (mentorId: string, page: number, limit: number, rating?: number) => {
	try {
		const response = await axiosInstance.get(`/user/reviews/${mentorId}`, {
			params: { page, limit, rating },
		});
		return response.data;
	} catch (error: any) {
		console.error("Error fetching reviews:", error);
		throw new Error(error.response.data.message);
	}
};
