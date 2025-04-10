import { UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";
import axiosInstance from "../api.config";

export const updateUserApi = async (userId: string, data: UpdateProfileFormData) => {
	try {
		const response = await axiosInstance.put("/user-profile/edit-profile", { userId, data });
		return response.data;
	} catch (error: any) {
		console.log(`Error form updateUser api : `, error);
		throw new Error(error.response.data.message);
	}
};
