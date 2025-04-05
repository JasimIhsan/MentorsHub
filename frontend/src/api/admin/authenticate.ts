import axiosInstance from "../api.config";

export const adminLoginAPI = async (username: string, password: string) => {
	try {
		const response = await axiosInstance.post("/admin/login", { username, password });
		return response.data;
	} catch (error: any) {
		console.log(`Error from admin login api : `, error);
		throw new Error(error.response?.data?.message || "An error occurred during login. Please try again.");
	}
};
