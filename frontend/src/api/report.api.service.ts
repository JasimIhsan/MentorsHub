import axiosInstance from "./config/api.config";

export const createReportAPI = async (reporterId: string, reportedId: string, reason: string) => {
	try {
		const response = await axiosInstance.post(`/user/reports/create`, { reporterId, reportedId, reason });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const fetchReportsAdminAPI = async (search: string, status: string, page: number, limit: number) => {
	try {
		const response = await axiosInstance.get(`/admin/reports`, {
			params: { search, status, page, limit },
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const updateReportStatusAPI = async (reportId: string, status: string, adminNote?: string) => {
	try {
		const response = await axiosInstance.put(`/admin/reports/${reportId}/status`, { status, adminNote });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};
