import axiosInstance from "../api.config";

export const verifyResetToken = async (token: string) => {
	try {
		const response = await axiosInstance(`/verify-reset-token/${token}`);
		return response.data;
	} catch (error) {
		console.log(`Error form verifyresettoken api : `, error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const resetPassword = async (token: string, newPassword: string) => {
	try {
		const response = await axiosInstance.post(`/reset-password`, { token, newPassword });
		return response.data;
	} catch (error: any) {
		throw new Error(error?.response?.data?.message);
	}
};

export const logoutSession = async () => {
	try {
		const response = await axiosInstance.post(`/logout`);
		return response.data;
	} catch (error) {
		console.log(`Error form logoutSession api : `, error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};
