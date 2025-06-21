import axios from "axios";
import { toast } from "sonner";

// Base URL of your backend API
const baseURL = `${import.meta.env.VITE_SERVER_URL}/api`;

// Create axios instance
const axiosInstance = axios.create({
	baseURL: baseURL,
	withCredentials: true, // for cookies (access/refresh tokens)
});

// === 🔁 Token Refresh Queue Mechanism ===
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
	refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
	refreshSubscribers.forEach((cb) => cb(token));
	refreshSubscribers = [];
}

// === 🔄 Function to Refresh Access Token ===
const refreshAccessToken = async (): Promise<string> => {
	try {
		const response = await axiosInstance.post("/user/refresh-token");
		const { accessToken } = response.data;

		// Set new token globally for future requests
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

		return accessToken;
	} catch (error) {
		// Redirect to login if refresh token is expired/invalid
		localStorage.removeItem("persist:root");
		window.location.href = "/authenticate";
		throw error;
	}
};

// === 📤 Request Interceptor ===
axiosInstance.interceptors.request.use(
	async (config) => {
		const accessToken = document.cookie
			.split("; ")
			.find((row) => row.startsWith("access_token="))
			?.split("=")[1];

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

// === 📥 Response Interceptor ===
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// === 🔐 Handle Expired Access Token ===
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				// Wait in queue if already refreshing
				return new Promise((resolve) => {
					subscribeTokenRefresh((token: string) => {
						originalRequest.headers["Authorization"] = `Bearer ${token}`;
						resolve(axiosInstance(originalRequest));
					});
				});
			}

			// Refresh token now
			isRefreshing = true;

			try {
				const newAccessToken = await refreshAccessToken();

				onRefreshed(newAccessToken); // Let others retry
				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

				return axiosInstance(originalRequest); // Retry failed request
			} catch (refreshError) {
				// Already handled inside refreshAccessToken
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		// === ⛔ Handle Forbidden (Blocked User) ===
		if (error.response?.status === 403) {
			localStorage.removeItem("persist:root");

			if (error.response.data?.blocked) {
				toast.error("Your account has been blocked.");
				setTimeout(() => {
					window.location.href = "/authenticate";
				}, 3000);
			} else {
				window.location.href = "/authenticate";
			}

			return Promise.reject(error);
		}

		// Other errors
		return Promise.reject(error);
	}
);

export default axiosInstance;
