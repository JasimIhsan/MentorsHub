import axiosInstance from "@/api/config/api.config";

export const fetchDocumentUrlsAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/documents/${userId}/documents`);
		return response.data;
	} catch (error: any) {
		console.log(`Error form fetchDocumentUrls api : `, error);
		throw new Error(error.response.data.message);
	}
};