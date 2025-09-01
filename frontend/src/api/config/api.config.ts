import axios, { AxiosError, AxiosInstance } from "axios";

// ============ CONFIG ============

const baseURL = import.meta.env.VITE_SERVER_URL as string;

// ============ TOKEN STORAGE (IN-MEMORY) ============
let currentAccessToken: string | null = null;

// ✅ Export this to manually update access token after login
export const setAccessToken = (token: string) => {
	currentAccessToken = token;
};

// ============ REFRESH CLIENT (NO INTERCEPTORS) ============

const tokenClient: AxiosInstance = axios.create({
	baseURL,
	withCredentials: true,
});

// ============ MAIN AXIOS INSTANCE ============

const axiosInstance: AxiosInstance = axios.create({
	baseURL,
	withCredentials: true, // ⬅️ Very important for refresh cookies
});

// ============ REFRESH ACCESS TOKEN FUNCTION ============

const refreshAccessToken = async (): Promise<string> => {
	try {
		const response = await tokenClient.post("/user/refresh-token", null); // ✅ No interceptors here
		const { accessToken } = response.data;

		if (!accessToken) throw new Error("No access token received");

		// ✅ Update in-memory access token
		currentAccessToken = accessToken;

		// ✅ Set for future axiosInstance requests
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

		return accessToken;
	} catch (error) {
		console.error("❌ Failed to refresh token", error);
		localStorage.removeItem("persist:root");
		// window.location.href = "/authenticate";
		throw error;
	}
};

// ============ REQUEST INTERCEPTOR ============

axiosInstance.interceptors.request.use(
	(config) => {
		if (currentAccessToken) {
			config.headers.Authorization = `Bearer ${currentAccessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// ============ RESPONSE INTERCEPTOR ============

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest: any = error.config;

		// ✅ Handle 401 – try refresh once
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const newToken = await refreshAccessToken();
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return axiosInstance(originalRequest); // ⬅️ Retry the original request
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}

		// ✅ Handle 403 – blocked user or session expired
		// if (error.response?.status === 403) {
		// 	localStorage.removeItem("persist:root");

		// 	if ((error.response.data as any)?.blocked) {
		// 		setTimeout(() => {
		// 			window.location.href = "/authenticate";
		// 		}, 3000);
		// 	} else {
		// 		window.location.href = "/authenticate";
		// 	}
		// 	return Promise.reject(error);
		// }

		return Promise.reject(error);
	}
);

// ============ EXPORT ============

export default axiosInstance;
