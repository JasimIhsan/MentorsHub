import { ISignupData } from "@/interfaces/interfaces";
import axiosInstance from "../config/api.config";

export const loginApi = async (email: string, password: string) => {
	try {
		const response = await axiosInstance.post("/user/login", { email, password });
		return response.data;
	} catch (error: any) {
		 console.error(`Error form login api : `, error);
		throw new Error(error.response.data.message)
	}
};

export const forgotPassword = async (email: string)=> {
	try {
		const response = await axiosInstance.post("/user/forgot-password", { email });
		return response.data;
	} catch (error: any) {
		 console.error(`Error form forgotpassword api : `, error);
		throw new Error(error.response.data.message);
	}
}

export const verifyResetToken = async (token: string) => {
	try {
		const response = await axiosInstance(`/user/verify-reset-token/${token}`);
		return response.data;
	} catch (error) {
		 console.error(`Error form verifyresettoken api : `, error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const resetPassword = async (token: string, newPassword: string) => {
	try {
		const response = await axiosInstance.post(`/user/reset-password`, { token, newPassword });
		return response.data;
	} catch (error: any) {
		throw new Error(error?.response?.data?.message);
	}
};

export const logoutSession = async () => {
	try {
		const response = await axiosInstance.post(`/user/logout`);
		return response.data;
	} catch (error) {
		 console.error(`Error form logoutSession api : `, error);
		if (error instanceof Error) {
			throw new Error(error.message);
		}
	}
};

export const sendOtp = async (email: string) => {
	try {
		const response = await axiosInstance.post(`/user/send-otp`, { email: email });
		return response.data;
	} catch (error: any) {
		 console.error(`Error form sendOtp api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const verifyOtpAndCompleteRegistration = async (otp: string, signupData: ISignupData) => {
	try {
		const response = await axiosInstance.post(`/user/register`, { otp, signupData });
		return response.data;
	} catch (error: any) {
		 console.error(`Error form verifyOtpAndCompleteRegistration api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const resendOTP = async (email: string) => {
	try {
		const response = await axiosInstance.post(`/user/resend-otp`, { email: email });
		return response.data;
	} catch (error: any) {
		 console.error(`Error form resendOTP api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const googleAthentication = async (credential: any) => {
	try {
		const response = await axiosInstance.post("/user/auth/google", { credential });
		return response.data;
	} catch (error: any) {
		 console.error(`Error from googleAuthentication api : `, error);
		throw new Error(error.response.data.message);
	}
};
