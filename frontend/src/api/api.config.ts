import axios from "axios";

// base URL for your API
const baseURL = "http://localhost:5858/api";

//create axios instance
const axiosInstance = axios.create({
	baseURL: baseURL,
	withCredentials: true,
});

//Function to refresh the access token
const refreshAccessToken = async () => {
	try {
		const response = await axios.post(`${baseURL}/refresh-token`, null, {
			withCredentials: true, // include cookies in the request
		});

		console.log("response from refreshAccessToken : ", response);
		const { accessToken } = response.data;
		// Set the new access token in the cookie (should be secure and same-site)
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
		return accessToken;
	} catch (error) {
		// console.log("Error from refreshing access token : ", error);
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			localStorage.clear();
			window.location.href = "/authenticate";
			return;
		}
		throw error;
	}
};

// Request interseptor to add access token from the cookies to the request headers before the request is sent
axiosInstance.interceptors.request.use(
	async (config) => {
		// extract the access token from cookies
		const accessToken = document.cookie
			.split("; ")
			.find((row) => row.startsWith("access_token="))
			?.split("=")[1];

		// if the access token exist , set it in the request headers
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error); // handle request errors
	}
);

// Response interceptor hadles the response and errors
axiosInstance.interceptors.response.use(
	(response) => {
		return response; // return the response if there is no error
	},
	// may be the response have error becuause of the access token expiration or something so refresh it
	async (error) => {
		// originalRequest._retry: A custom flag to ensure the original request is retried only once.
		const originalRequest = error.config;
		// if the response status is 401 (unauthorized) and the request hasn't been retried
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				// refresh the access token
				const newAccessToken = await refreshAccessToken();
				// update the default authorization header with the new access token
				axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
				// resend the original request with the new access token

				return axiosInstance(originalRequest);
			} catch (refreshError) {
				console.log("Error from refreshing access token : ", refreshError);
				return Promise.reject(refreshError); // handle the token refresh error
			}
		}
		return Promise.reject(error); // handle other response error
	}
);

export default axiosInstance;
