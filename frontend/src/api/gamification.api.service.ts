import axiosInstance from "./config/api.config";

// Interfaces for API responses
interface ActionType {
	_id: string;
	_label: string;
}

interface GamificationTask {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
	createdAt: string;
	isListed: boolean;
}

interface ActionTypeResponse {
	success: boolean;
	actionTypes: ActionType[];
}

interface TaskResponse {
	success: boolean;
	task: GamificationTask;
}

// Create a new action type
export const createActionTypeAdminAPI = async (data: { label: string; id: string }) => {
	try {
		const response = await axiosInstance.post("/admin/gamification/create-action-type", data);
		return response.data;
	} catch (error: any) {
		console.error("Error in createActionTypeAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to create action type");
	}
};

// Get all action types
export const getActionTypesAdminAPI = async () => {
	try {
		const response = await axiosInstance.get<ActionTypeResponse>("/admin/gamification/action-types");
		return response.data.actionTypes.map((type) => ({
			id: type._id,
			label: type._label,
		}));
	} catch (error: any) {
		console.error("Error in getActionTypesAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch action types");
	}
};

// Create a new gamification task
export const createGamificationTaskAdminAPI = async (data: { title: string; xpReward: number; targetCount: number; actionType: string }) => {
	try {
		const response = await axiosInstance.post<TaskResponse>("/admin/gamification/create-task", data);
		return response.data.task;
	} catch (error: any) {
		console.error("Error in createGamificationTaskAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to create task");
	}
};

// Get all gamification tasks with pagination
export const getAllGamificationTasksAdminAPI = async (page = 1, limit = 10, actionType?: string, searchTerm?: string) => {
	try {
		const response = await axiosInstance.get("/admin/gamification/", {
			params: { page, limit, actionType, searchTerm },
		});
		return response.data;
	} catch (error: any) {
		console.error("Error in getAllGamificationTasksAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch tasks");
	}
};

// Toggle task listing status
export const toggleTaskListStatusAdminAPI = async (taskId: string, status: boolean) => {
	try {
		const response = await axiosInstance.patch<TaskResponse>(`/admin/gamification/tasks/${taskId}/toggle-list`, { status });
		return response.data.task;
	} catch (error: any) {
		console.error("Error in toggleTaskListStatusAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to toggle task status");
	}
};

// Delete gamification task
export const deleteGamificationTaskAdminAPI = async (taskId: string) => {
	try {
		const response = await axiosInstance.delete<TaskResponse>(`/admin/gamification/tasks/${taskId}`);
		return response.data.task;
	} catch (error: any) {
		console.error("Error in deleteGamificationTaskAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to delete task");
	}
};

export const updateGamificationTaskAdminAPI = async (taskId: string, data: { title: string; xpReward: number; targetCount: number; actionType: string }) => {
	try {
		const response = await axiosInstance.put<TaskResponse>(`/admin/gamification/tasks/${taskId}`, data);
		return response.data.task;
	} catch (error: any) {
		console.error("Error in updateGamificationTaskAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to update task");
	}
};

export const fetchListedGamificationTasks = async (userId: string, searchTerm: string, page: number, limit: number) => {
	try {
		const response = await axiosInstance.get(`/user/gamification/listed/${userId}`, {
			params: {
				page,
				limit,
				searchTerm,
			},
		});
		return response.data;
	} catch (error: any) {
		console.error("Error fetching tasks:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch tasks");
	}
};

export const fetchUserProgressAPI = async (userId: string) => {
	try {
		const response = await axiosInstance.get(`/user/gamification/progress/${userId}`);
		return response.data;
	} catch (error: any) {
		console.error("Error fetching user progress:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch user progress");
	}
};