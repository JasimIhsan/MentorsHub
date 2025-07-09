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

export const fetchPlatformRevenueChartData = async (adminId: string, range: string) => {
	try {
		const response = await axiosInstance.get(`/admin/dashboard/revenue/${adminId}/?range=${range}`);
		return response.data;
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message);
		throw new Error("Failed to fetch platform revenue chart data");
	}
};

export const fetchUsersGrowthChartData = async (adminId: string, range: string) => {
	try {
		const response = await axiosInstance.get(`/admin/dashboard/growth/${adminId}?range=${range}`);
		return response.data;
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message);
		throw new Error("Failed to fetch users growth chart data");
	}
};

export const fetchTopMentorsData = async () => {
	try {
		const response = await axiosInstance.get(`/admin/dashboard/top-mentors`);
		return response.data;
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message);
		throw new Error("Failed to fetch top mentors data");
	}
};
