import axiosInstance from "@/api/config/api.config";

export const fetchDocumentUrlsAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/documents/${userId}/documents`);
		return response.data;
	} catch (error: any) {
		console.error(`Error form fetchDocumentUrls api : `, error);
		throw new Error(error.response.data.message);
	}
};

export const fetchDocumentUrlByKeyAPI = async (userId: string, key: string) => {
	try {
		const response = await axiosInstance.get(`/documents/${userId}/document`, {
			params: {
				documentKey: key
			}
		});
		return response.data;
	} catch (error: any) {
		console.error(`Error form fetchDocumentUrlByKey api : `, error);
		throw new Error(error.response.data.message);
	}
};
