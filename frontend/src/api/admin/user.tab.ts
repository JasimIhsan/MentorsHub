import axiosInstance from "../api.config";

export const fetchAllUsers = async () => {
	try {
		const response = await axiosInstance.get(`/admin/users`);
		console.log('api response: ', response);

		return response.data;
	} catch (error: any) {
		console.log(`Error form fetchAllUsers api : `, error);
		throw new Error(error.response.data.message);
	}
};
