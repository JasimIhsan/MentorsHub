import { handleAPIError } from "@/utility/handleApiError";
import axiosInstance from "./config/api.config";

export const fetchWalletDataAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/user/wallet/${userId}`);
		return response.data;
	} catch (error: any) {
		return handleAPIError(error);
	}
};

export const fetchTransactionsAPI = async (userId: string, page: number, limit: number, type: string, from: string, to: string) => {
	try {
		// Send GET request with all filter parameters
		const response = await axiosInstance.get(`/user/wallet/transactions/${userId}`, {
			params: {
				page,
				limit,
				type,
				from,
				to,
			},
		});
		return response.data; // Return the API response
	} catch (error: any) {
		return handleAPIError(error); // Handle errors using utility function
	}
};

// const topUpData = {
// 	amount: number
// 	purpose: "wallet_topup",
// 	description: "Wallet topup",
// 	razorpay_payment_id: response.razorpay_payment_id,
// 	razorpay_order_id: response.razorpay_order_id,
// 	razorpay_signature: response.razorpay_signature,
// };

// const topUpResponse = await axiosInstance.post(`/user/wallet/top-up/${user?.id}`, topUpData);

export const topupWalletAPI = async (userId: string, data: { amount: number; purpose: string; description: string }) => {
	try {
		const response = await axiosInstance.post(`/user/wallet/top-up/${userId}`, data); // Send POST request with the amount
		return response.data; // Return the API response
	} catch (error: any) {
		return handleAPIError(error); // Handle errors using utility function
	}
};

export const fetchPlatformWalletDataAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/admin/wallet/${userId}`);
		return response.data;
	} catch (error: any) {
		return handleAPIError(error);
	}
};

export const fetchPlatformTransactionsAPI = async (userId: string, page: number, limit: number, type: string, from: string, to: string) => {
	try {
		// Send GET request with all filter parameters
		const response = await axiosInstance.get(`/admin/wallet/transactions/${userId}`, {
			params: {
				page,
				limit,
				type,
				from,
				to,
			},
		});
		return response.data; // Return the API response
	} catch (error: any) {
		return handleAPIError(error); // Handle errors using utility function
	}
};
