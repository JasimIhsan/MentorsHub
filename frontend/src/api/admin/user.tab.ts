import axiosInstance from "../config/api.config";

interface FetchUsersParams {
	page: number;
	limit: number;
	role?: string;
	status?: string;
	search?: string;
}

export const fetchAllUsers = async (params: FetchUsersParams) => {
	try {
		const response = await axiosInstance.get(`/admin/users`, {
			params: {
				page: params.page,
				limit: params.limit,
				role: params.role,
				status: params.status,
				search: params.search,
			},
		});
		return response.data;
	} catch (error: any) {
		 console.error(`Error form fetchAllUsers api : `, error);
		throw new Error(error.response.data.message);
	}
};

interface CreateUserData {
	firstName: string;
	lastName?: string | undefined;
	email: string;
	role: string | undefined;
	sendEmail: boolean;
}

export const createUserApi = async (data: CreateUserData) => {
	try {
		const response = await axiosInstance.post(`/admin/users/create-user`, data);
		return response.data;
	} catch (error: any) {
		 console.error(`Error form createUserApi api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const updateUserStatusApi = async (userId: string) => {
	try {
		const response = await axiosInstance.put(`/admin/users/update-status/${userId}`);
		return response.data;
	} catch (error: any) {
		 console.error(`Error form updateUserStatusApi api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const deleteUserApi = async (userId: string) => {
	try {
		const response = await axiosInstance.delete(`/admin/users/delete-user/${userId}`);
		return response.data;
	} catch (error: any) {
		 console.error("Error from deleteUserApi: ", error);
		throw new Error(error.response.data.message);
	}
};

export const updateUserApi = async (userId: string, data: CreateUserData) => {
	try {
		const response = await axiosInstance.put(`/admin/users/update-user/${userId}`, data);
		return response.data;
	} catch (error: any) {
		 console.error(`Error from updateUserApi : `, error);
		throw new Error(error.response.data.message);
	}
};
