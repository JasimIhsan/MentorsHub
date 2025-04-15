import { ISignupData } from "@/interfaces/interfaces";
import axiosInstance from "../api.config";

export const loginApi = async (email: string, password: string) => {
	try {
		const response = await axiosInstance.post("/login", { email, password });
		return response.data;
	} catch (error: any) {
		console.log(`Error form login api : `, error);
		throw new Error(error.response.data.message)
	}
};

export const forgotPassword = async (email: string)=> {
	try {
		const response = await axiosInstance.post("/forgot-password", { email });
		return response.data;
	} catch (error: any) {
		console.log(`Error form forgotpassword api : `, error);
		throw new Error(error.response.data.message);
	}
}

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
		console.log("email: ", email);
		const response = await axiosInstance.post(`/send-otp`, { email: email });
		console.log(`response: `, response);
		return response.data;
	} catch (error: any) {
		console.log(`Error form sendOtp api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const verifyOtpAndCompleteRegistration = async (otp: string, signupData: ISignupData) => {
	console.log("signupData: ", signupData);
	console.log("otp: ", otp);
	try {
		const response = await axiosInstance.post(`/register`, { otp, signupData });
		console.log('response forgot: ', response);

		return response.data;
	} catch (error: any) {
		console.log(`Error form verifyOtpAndCompleteRegistration api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const resendOTP = async (email: string) => {
	try {
		const response = await axiosInstance.post(`/resend-otp`, { email: email });
		return response.data;
	} catch (error: any) {
		console.log(`Error form resendOTP api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const googleAthentication = async (credential: any) => {
	console.log("credential: ", credential);
	try {
		const response = await axiosInstance.post("/auth/google", { credential });
		return response.data;
	} catch (error: any) {
		console.log(`Error from googleAuthentication api : `, error);
		throw new Error(error.response.data.message);
	}
};
