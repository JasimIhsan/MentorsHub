import axiosInstance from "./config/api.config";

export const fetchWithdrawalsAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/user/withdrawals/${userId}`);
		return response.data;
	} catch (error: any) {
		console.error("Error in fetchWithdrawalsAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const reqeustWithdrawalAPI = async (userId: string, amount: number) => {
	try {
		const response = await axiosInstance.post(`/user/withdrawal/create/${userId}`, { amount });
		return response.data;
	} catch (error: any) {
		console.error("Error in reqeustWithdrawalAPI:", error);
		throw new Error(error.response.data.message);
	}
};
