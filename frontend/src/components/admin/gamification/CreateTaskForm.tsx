"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateActionTypeModal } from "./CreateActionTypeModal";
import { useGamificationAPI } from "@/hooks/useGamification";
import { ActionType, CreateTaskData } from "@/interfaces/gamification";

interface CreateTaskFormProps {
	onTaskCreated: () => void;
}

export const CreateTaskForm = ({ onTaskCreated }: CreateTaskFormProps) => {
	const [actionTypes, setActionTypes] = useState<ActionType[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedActionType, setSelectedActionType] = useState<string>("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm<CreateTaskData>();
	const { loading, error, fetchActionTypes, createTask, createActionType } = useGamificationAPI();

	useEffect(() => {
		loadActionTypes();
	}, []);

	const loadActionTypes = async () => {
		const types = await fetchActionTypes();
		if (types) {
			setActionTypes(types);
		}
	};

	const handleCreateActionType = async (data: { label: string; id: string }) => {
		const newActionType = await createActionType(data);
		if (newActionType) {
			await loadActionTypes();
			setSelectedActionType(newActionType.id);
			setValue("actionType", newActionType.id);
		}
	};

	const handleFormSubmit = async (data: CreateTaskData) => {
		const taskData = {
			...data,
			actionType: selectedActionType,
		};

		const newTask = await createTask(taskData);
		if (newTask) {
			reset();
			setSelectedActionType("");
			onTaskCreated();
		}
	};

	const handleActionTypeChange = (value: string) => {
		if (value === "ADD_NEW") {
			setIsModalOpen(true);
		} else {
			setSelectedActionType(value);
			setValue("actionType", value);
		}
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Create New Gamification Task</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="title">Title</Label>
								<Input id="title" placeholder="Enter task title" {...register("title", { required: "Title is required" })} />
								{errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
							</div>

							<div>
								<Label htmlFor="xpReward">XP Reward</Label>
								<Input
									id="xpReward"
									type="number"
									min="1"
									placeholder="Enter XP reward"
									{...register("xpReward", {
										required: "XP Reward is required",
										min: { value: 1, message: "XP Reward must be at least 1" },
									})}
								/>
								{errors.xpReward && <p className="text-red-500 text-sm mt-1">{errors.xpReward.message}</p>}
							</div>

							<div>
								<Label htmlFor="targetCount">Target Count</Label>
								<Input
									id="targetCount"
									type="number"
									min="1"
									placeholder="Enter target count"
									{...register("targetCount", {
										required: "Target Count is required",
										min: { value: 1, message: "Target Count must be at least 1" },
									})}
								/>
								{errors.targetCount && <p className="text-red-500 text-sm mt-1">{errors.targetCount.message}</p>}
							</div>

							<div>
								<Label htmlFor="actionType">Action Type</Label>
								<Select value={selectedActionType} onValueChange={handleActionTypeChange}>
									<SelectTrigger>
										<SelectValue placeholder="Select action type" />
									</SelectTrigger>
									<SelectContent>
										{actionTypes.map((type) => (
											<SelectItem key={type.id} value={type.id}>
												{type.label}
											</SelectItem>
										))}
										<SelectItem value="ADD_NEW" className="text-blue-600 font-medium">
											<div className="flex items-center">
												<Plus className="h-4 w-4 mr-2" />
												Add new action type…
											</div>
										</SelectItem>
									</SelectContent>
								</Select>
								{!selectedActionType && <p className="text-red-500 text-sm mt-1">Action Type is required</p>}
							</div>
						</div>

						{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

						<div className="flex justify-end">
							<Button type="submit" disabled={loading || !selectedActionType}>
								{loading ? "Creating..." : "Create Task"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			<CreateActionTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateActionType} loading={loading} />
		</>
	);
};
