import { useState, useCallback } from "react";
import axios from "axios";
import type { GamificationTask, ActionType, CreateTaskData, CreateActionTypeData, PaginatedResponse } from "../interfaces/gamification.interface";

const api = axios.create({
	baseURL: "/admin/gamification-task",
	headers: {
		"Content-Type": "application/json",
	},
});

export const useGamificationAPI = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleRequest = useCallback(async (request: () => Promise<any>): Promise<any | null> => {
		setLoading(true);
		setError(null);
		try {
			const result = await request();
			return result;
		} catch (err) {
			const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || err.message : "An unexpected error occurred";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchTasks = useCallback(
		async (page = 1, limit = 10) => {
			return handleRequest(async () => {
				const response = await api.get<PaginatedResponse<GamificationTask>>("/", {
					params: { page, limit },
				});
				return response.data;
			});
		},
		[handleRequest]
	);

	const fetchActionTypes = useCallback(async () => {
		return handleRequest(async () => {
			const response = await api.get<ActionType[]>("/action-types");
			return response.data;
		});
	}, [handleRequest]);

	const createTask = useCallback(
		async (taskData: CreateTaskData) => {
			return handleRequest(async () => {
				const response = await api.post<GamificationTask>("/create-task", taskData);
				return response.data;
			});
		},
		[handleRequest]
	);

	const createActionType = useCallback(
		async (actionTypeData: CreateActionTypeData) => {
			return handleRequest(async () => {
				const response = await api.post<ActionType>("/create-action-type", actionTypeData);
				return response.data;
			});
		},
		[handleRequest]
	);

	return {
		loading,
		error,
		fetchTasks,
		fetchActionTypes,
		createTask,
		createActionType,
	};
};
