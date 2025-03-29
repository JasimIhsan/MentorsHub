import { ISignupData } from "@/interfaces/interfaces";
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

export const sendOtp = async (email: string) => {
	try {
		const response = await axiosInstance.post(`/send-otp`, email);
		return response.data;
	} catch (error) {
		console.log(`Error form sendOtp api : `, error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const verifyOtpAndCompleteRegistration = async (otp: string, signupData: ISignupData) => {
	console.log("signupData: ", signupData);
	console.log("otp: ", otp);
	try {
		const response = await axiosInstance.post(`/register`, { otp, signupData });
		return response.data;
	} catch (error) {
		console.log(`Error form verifyOtpAndCompleteRegistration api : `, error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};
