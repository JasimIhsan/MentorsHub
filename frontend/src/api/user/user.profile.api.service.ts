import axiosInstance from "../config/api.config";
import { UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";

export const updateUserApi = async (userId: string, data: UpdateProfileFormData & { avatar?: string }) => {
	try {
		const formData = new FormData();
		formData.append("userId", userId);
		formData.append("firstName", data.firstName);
		formData.append("lastName", data.lastName ?? "");
		formData.append("email", data.email);
		formData.append("skills", JSON.stringify(data.skills));
		formData.append("interests", JSON.stringify(data.interests));
		formData.append("bio", data.bio ?? "");

		if (data.avatar && data.avatar.startsWith("data:")) {
			// Convert base64 to Blob
			const response = await fetch(data.avatar);
			const blob = await response.blob();
			formData.append("avatar", blob, "avatar.jpg");
		}

		const response = await axiosInstance.put("/user/user-profile/edit-profile", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error: any) {
		console.log(`Error from updateUser api: `, error);
		throw new Error(error.response.data.message);
	}
};

export const changePasswordApi = async (userId: string, oldPassword: string, newPassword: string) => {
	try {
		const response = await axiosInstance.put("/user/user-profile/change-password", { userId, oldPassword, newPassword });
		return response.data;
	} catch (error: any) {
		console.log(`Error from changePassword api: `, error);
		throw new Error(error.response.data.message);
	}
};

export const getUserProfileApi = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/user/user-profile/${userId}`);
		return response.data;
	} catch (error: any) {
		console.log(`Error from getUserProfile api: `, error);
		throw new Error(error.response.data.message);
	}
};
