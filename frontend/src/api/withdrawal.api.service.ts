import axiosInstance from "./config/api.config";

export const fetchWithdrawalsAdminAPI = async (page: number, limit: number, status: string, searchTerm?: string) => {
	try {
		const response = await axiosInstance.get(`/admin/withdrawal/requests/`, {
			params: { page, limit, searchTerm, status },
		});
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

export const withdrawPaymentCreateOrderAdminAPI = async (requestId: string) => {
	try {
		const response = await axiosInstance.get(`/admin/withdrawal/payment/order/${requestId}`);
		console.log("response: ", response);
		return response.data;
	} catch (error: any) {
		console.error("Error in withdrawPaymentCreateOrderAdminAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const approveWithdrawalRequestAdminAPI = async (requestId: string, paymentId: string) => {
	try {
		const response = await axiosInstance.post(`/admin/withdrawal/approve/${requestId}`, { paymentId });
		return response.data;
	} catch (error: any) {
		console.error("Error in approveWithdrawalRequestAdminAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const rejectWithdrawalRequestAdminAPI = async (requestId: string) => {
	try {
		const response = await axiosInstance.put(`/admin/withdrawal/reject/${requestId}`);
		return response.data;
	} catch (error: any) {
		console.error("Error in rejectWithdrawalRequestAdminAPI:", error);
		throw new Error(error.response.data.message);
	}
};
