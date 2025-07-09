import axiosInstance from "../config/api.config";

export const fetchAdminDashboardData = async (adminId: string) => {
	try {
		const response = await axiosInstance.get(`/admin/dashboard/stats/${adminId}`);
		return response.data;
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message);
		throw new Error("Failed to fetch admin dashboard data");
	}
};

export const fetchPlatformRevenueChartData = async (adminId: string) => {
	try {
		const response = await axiosInstance.get(`/admin/dashboard/revenue/${adminId}`);
		return response.data;
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message);
		throw new Error("Failed to fetch platform revenue chart data");		
	}
}