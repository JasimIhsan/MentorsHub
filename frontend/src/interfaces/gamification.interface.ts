export interface GamificationTask {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
	createdAt: string;
	isListed: boolean;
}

export interface ActionType {
	id: string;
	label: string;
}

export interface CreateTaskData {
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
}

export interface CreateActionTypeData {
	label: string;
	id: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface ActionTypeFormData {
	label: string;
}
