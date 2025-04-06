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

		const { accessToken } = response.data;
		// Set the new access token in the cookie (should be secure and same-site)
		axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
		return accessToken;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			localStorage.removeItem("persist:root");
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
	// may be the response has an error because of the access token expiration or something, so refresh it
	async (error) => {
		console.log("error in api config : ", error);

		// originalRequest._retry: A custom flag to ensure the original request is retried only once.
		const originalRequest = error.config;
		// if the response status is 401 (unauthorized) and the request hasn't been retried
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				console.log(`in 401`);
				// refresh the access token
				const newAccessToken = await refreshAccessToken();
				// update the default authorization header with the new access token
				axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
				// resend the original request with the new access token
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem("persist:root");
				window.location.href = "/authenticate";
				return Promise.reject(refreshError); // handle the token refresh error
			}
		} else if (error.response.status === 403) {
			console.log(`in 403`, error);
			localStorage.removeItem("persist:root");

			if (error.response.data.blocked) {

				setTimeout(() => {
					window.location.href = "/authenticate";
				}, 3000);
				
				return Promise.reject(error); // Don't propagate the 403 error further
			} else {
				window.location.href = "/authenticate";
				return Promise.reject(error); // Handle non-blocked 403 as well
			}
		}

		// If error status isn't 401 or 403, propagate the error
		return Promise.reject(error);
	}
);

export default axiosInstance;
