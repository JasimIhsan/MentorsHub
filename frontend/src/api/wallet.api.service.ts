import axiosInstance from "./config/api.config";

export const fetchWalletDataAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/user/wallet/${userId}`);
		return response.data;
	} catch (error: any) {
		console.error("Error in fetchWalletDataAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const fetchTransactionsAPI = async (userId: string, page: number, limit: number, type: string, from: string, to: string) => {
	try {
		const response = await axiosInstance.get(`/user/wallet/transactions/${userId}`, {
			params: { page, limit, type, from, to },
		});
		return response.data;
	} catch (error: any) {
		console.error("Error in fetchTransactionsAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const topupWalletAPI = async (userId: string, data: { amount: number; purpose: string; description: string }) => {
	try {
		const response = await axiosInstance.post(`/user/wallet/top-up/${userId}`, data);
		return response.data;
	} catch (error: any) {
		console.error("Error in topupWalletAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const withdrawWalletAPI = async (userId: string, amount: number) => {
	try {
		const response = await axiosInstance.post(`/user/wallet/withdraw/${userId}`, { amount });
		return response.data;
	} catch (error: any) {
		console.error("Error in withdrawWalletAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const fetchPlatformWalletDataAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/admin/wallet/${userId}`);
		return response.data;
	} catch (error: any) {
		console.error("Error in fetchPlatformWalletDataAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const fetchPlatformTransactionsAPI = async (userId: string, page: number, limit: number, type: string, from: string, to: string) => {
	try {
		const response = await axiosInstance.get(`/admin/wallet/transactions/${userId}`, {
			params: { page, limit, type, from, to },
		});
		return response.data;
	} catch (error: any) {
		console.error("Error in fetchPlatformTransactionsAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const withdrawPlatformWalletAPI = async (userId: string, amount: number) => {
	try {
		const response = await axiosInstance.post(`/admin/wallet/withdraw/${userId}`, { amount });
		return response.data;
	} catch (error: any) {
		console.error("Error in withdrawPlatformWalletAPI:", error);
		throw new Error(error.response.data.message);
	}
};

export const createWalletAPI = async (userId: string, role: string) => {
	try {
		const response = await axiosInstance.post(`/user/wallet/create`, { userId, role }); 
		return response.data;
	} catch (error: any) {
		console.error("Error in createWalletAPI:", error);
		throw new Error(error.response.data.message);
	}
};
