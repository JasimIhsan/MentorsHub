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
		console.log("createActionTypeAdminAPI response:", response.data); // Debug log
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
		console.log("getActionTypesAdminAPI response:", response.data); // Debug log
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
		console.log("createGamificationTaskAdminAPI response:", response.data); // Debug log
		return response.data.task;
	} catch (error: any) {
		console.error("Error in createGamificationTaskAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to create task");
	}
};

// Get all gamification tasks with pagination
export const getAllGamificationTasksAdminAPI = async (page = 1, limit = 10) => {
	try {
		const response = await axiosInstance.get("/admin/gamification/", {
			params: { page, limit },
		});
		console.log("getAllGamificationTasksAdminAPI response:", response.data); // Debug log
		return response.data;
	} catch (error: any) {
		console.error("Error in getAllGamificationTasksAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch tasks");
	}
};

// Toggle task listing status
export const toggleTaskListStatusAdminAPI = async (taskId: string) => {
	try {
		const response = await axiosInstance.patch<TaskResponse>(`/admin/gamification/tasks/${taskId}/toggle-list`);
		console.log("toggleTaskListStatusAdminAPI response:", response.data); // Debug log
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
		console.log("deleteGamificationTaskAdminAPI response:", response.data); // Debug log
		return response.data.task;
	} catch (error: any) {
		console.error("Error in deleteGamificationTaskAdminAPI:", error);
		throw new Error(error.response?.data?.message || "Failed to delete task");
	}
};
