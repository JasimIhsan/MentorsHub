import { z } from "zod";

// Zod Schemas
export const createActionTypeSchema = z.object({
	label: z.string().min(1, "Label is required").max(100, "Label must be 100 characters or less"),
});

export const taskSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
	xpReward: z.number().min(1, "XP Reward must be at least 1"),
	targetCount: z.number().min(1, "Target Count must be at least 1"),
	actionType: z.string().min(1, "Action Type is required"),
});
