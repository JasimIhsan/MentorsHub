import { getActionTypesAdminAPI, createGamificationTaskAdminAPI, createActionTypeAdminAPI } from "@/api/gamification.api.service";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreateTaskData, CreateActionTypeData } from "@/interfaces/gamification.interface";
import { taskSchema } from "@/schema/gamification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CreateActionTypeDialog } from "./CreateActionTypeModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Create Task Form Component
export const CreateTaskForm = ({ onTaskCreated }: { onTaskCreated: () => void }) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<CreateTaskData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			xpReward: 0,
			targetCount: 0,
		},
	});
	const [isActionTypeDialogOpen, setIsActionTypeDialogOpen] = useState(false);
	const [actionTypes, setActionTypes] = useState<CreateActionTypeData[]>([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [actionTypeRefreshTrigger, setActionTypeRefreshTrigger] = useState(0);

	// Fetch action types on mount and when actionTypeRefreshTrigger changes
	useEffect(() => {
		const fetchActionTypes = async () => {
			try {
				setIsLoading(true);
				const types = await getActionTypesAdminAPI();
				setActionTypes(types);
			} catch (err: any) {
				toast.error(err.message || "Failed to load action types.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchActionTypes();
	}, [actionTypeRefreshTrigger]);

	const handleCreateTask = async (data: CreateTaskData) => {
		try {
			await createGamificationTaskAdminAPI({
				title: data.title,
				xpReward: Number(data.xpReward),
				targetCount: Number(data.targetCount),
				actionType: data.actionType,
			});
			reset();
			onTaskCreated();
			setIsFormOpen(false);
			toast.success("Task created successfully!");
		} catch (err: any) {
			toast.error(err.message || "Failed to create task.");
		}
	};

	const handleCreateActionType = async (data: CreateActionTypeData) => {
		try {
			const type = await createActionTypeAdminAPI(data);
			setActionTypes((prev) => [...prev, type]);
			setActionTypeRefreshTrigger((prev) => prev + 1);
			toast.success("Action type created successfully!");
		} catch (err: any) {
			toast.error(err.message || "Failed to create action type.");
		}
	};

	if (isLoading) {
		return <div className="text-center py-4">Loading action types...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-800">Create New Task</h2>
				<Button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center rounded-lg">
					{isFormOpen ? <Minus className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
					{isFormOpen ? "Hide Form" : "Create Task"}
				</Button>
			</div>
			<div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFormOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
				<Card className="mt-4">
					<CardContent className="pt-6">
						<form onSubmit={handleSubmit(handleCreateTask)} className="space-y-6">
							<div>
								<Label htmlFor="title" className="text-sm font-medium text-gray-700">
									Task Title
								</Label>
								<Input id="title" placeholder="e.g., Complete profile" className="mt-1 rounded-lg" {...register("title")} />
								{errors.title && <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>}
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="xpReward" className="text-sm font-medium text-gray-700">
										XP Reward
									</Label>
									<Input id="xpReward" type="number" placeholder="e.g., 100" className="mt-1 rounded-lg" {...register("xpReward", { valueAsNumber: true })} />
									{errors.xpReward && <p className="text-red-500 text-sm mt-2">{errors.xpReward.message}</p>}
								</div>
								<div>
									<Label htmlFor="targetCount" className="text-sm font-medium text-gray-700">
										地上1 Target Count
									</Label>
									<Input id="targetCount" type="number" placeholder="e.g., 1" className="mt-1 rounded-lg" {...register("targetCount", { valueAsNumber: true })} />
									{errors.targetCount && <p className="text-red-500 text-sm mt-2">{errors.targetCount.message}</p>}
								</div>
							</div>
							<div>
								<Label htmlFor="actionType" className="text-sm font-medium text-gray-700">
									Action Type
								</Label>
								<div className="flex space-x-3 mt-1">
									<Controller
										name="actionType"
										control={control}
										render={({ field }) => (
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger className="flex-1 rounded-lg px-3 py-2 text-gray-700">
													<SelectValue placeholder="Select an action type" />
												</SelectTrigger>
												<SelectContent>
													{actionTypes.length === 0 ? (
														<div className="text-gray-500 p-2">No action types available</div>
													) : (
														actionTypes.map((type) => (
															<SelectItem key={type.id} value={type.id || "default"}>
																{type.label}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
										)}
									/>
									{/* <Button type="button" variant="outline" onClick={() => setIsActionTypeDialogOpen(true)} className="rounded-lg border-gray-300 hover:bg-gray-50">
										<Plus className="h-4 w-4 mr-2" />
										Add New
									</Button> */}
								</div>
								{errors.actionType && <p className="text-red-500 text-sm mt-2">{errors.actionType.message}</p>}
							</div>
							<div className="flex justify-end">
								<Button type="submit">Create Task</Button>
							</div>
						</form>
						<CreateActionTypeDialog isOpen={isActionTypeDialogOpen} onClose={() => setIsActionTypeDialogOpen(false)} onSubmit={handleCreateActionType} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
