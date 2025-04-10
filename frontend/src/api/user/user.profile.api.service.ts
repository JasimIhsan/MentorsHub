import axiosInstance from "../api.config";
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

		const response = await axiosInstance.put("/user-profile/edit-profile", formData, {
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
