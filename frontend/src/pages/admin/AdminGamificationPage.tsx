import { useState, useEffect } from "react";
import { Gamepad2, X, Plus, Minus, ChevronLeft, ChevronRight, Eye, EyeOff, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useForm, Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { createActionTypeAdminAPI, getActionTypesAdminAPI, createGamificationTaskAdminAPI, getAllGamificationTasksAdminAPI, toggleTaskListStatusAdminAPI, deleteGamificationTaskAdminAPI, updateGamificationTaskAdminAPI } from "@/api/gamification.api.service";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schemas
const createActionTypeSchema = z.object({
	label: z.string().min(1, "Label is required").max(100, "Label must be 100 characters or less"),
});

const taskSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
	xpReward: z.number().min(1, "XP Reward must be at least 1"),
	targetCount: z.number().min(1, "Target Count must be at least 1"),
	actionType: z.string().min(1, "Action Type is required"),
});

// Interfaces
interface GamificationTask {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
	createdAt: string;
	isListed: boolean;
}

interface CreateTaskData {
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
}

interface CreateActionTypeData {
	id: string;
	label: string;
}

interface ActionTypeFormData {
	label: string;
}

// Create Action Type Dialog Component
interface CreateActionTypeDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreateActionTypeData) => void;
}

const CreateActionTypeDialog = ({ isOpen, onClose, onSubmit }: CreateActionTypeDialogProps) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
		reset,
	} = useForm<ActionTypeFormData>({
		resolver: zodResolver(createActionTypeSchema),
	});
	const [generatedId, setGeneratedId] = useState("");
	const labelValue = watch("label", "");

	// Auto-generate ID when label changes
	const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const label = e.target.value;
		const id = label.toUpperCase().replace(/\s+/g, "_");
		setGeneratedId(id);
		setValue("label", label);
	};

	const handleFormSubmit = async (data: ActionTypeFormData) => {
		try {
			await onSubmit({
				label: data.label,
				id: generatedId,
			});
			reset();
			setGeneratedId("");
			onClose();
		} catch (err: any) {
			toast.error(err.message || "Failed to create action type.");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg w-full p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-gray-800">Create New Action Type</DialogTitle>
					<DialogClose asChild>
						<Button variant="ghost" size="icon" className="absolute right-4 top-4 hover:bg-gray-100 rounded-full">
							<X className="h-5 w-5 text-gray-600" />
						</Button>
					</DialogClose>
				</DialogHeader>
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
					<div>
						<Label htmlFor="label" className="text-sm font-medium text-gray-700">
							Action Label
						</Label>
						<Input id="label" placeholder="e.g., Watch a video" className="mt-1 rounded-lg" {...register("label")} onChange={handleLabelChange} />
						{errors.label && <p className="text-red-500 text-sm mt-2">{errors.label.message}</p>}
					</div>
					<div>
						<Label htmlFor="generatedId" className="text-sm font-medium text-gray-700">
							Generated ID
						</Label>
						<Input id="generatedId" value={generatedId} readOnly className="mt-1 bg-gray-50 rounded-lg border-gray-200" placeholder="Auto-generated from label" />
					</div>
					<div className="flex justify-end space-x-3 pt-4">
						<Button type="button" variant="outline" onClick={onClose} className="rounded-lg border-gray-300 hover:bg-gray-50">
							Cancel
						</Button>
						<Button type="submit" disabled={!labelValue.trim()}>
							Create Action Type
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

// Edit Task Dialog Component
interface EditTaskDialogProps {
	isOpen: boolean;
	onClose: () => void;
	task: GamificationTask | null;
	actionTypes: CreateActionTypeData[];
	onSubmit: (taskId: string, data: CreateTaskData) => void;
}

const EditTaskDialog = ({ isOpen, onClose, task, actionTypes, onSubmit }: EditTaskDialogProps) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		formState: { errors },
	} = useForm<CreateTaskData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			xpReward: 0,
			targetCount: 0,
			actionType: "",
		},
	});

	// Populate form with task data when dialog opens
	useEffect(() => {
		if (task) {
			setValue("title", task.title);
			setValue("xpReward", task.xpReward);
			setValue("targetCount", task.targetCount);
			setValue("actionType", task.actionType);
		}
	}, [task, setValue]);

	const handleFormSubmit = async (data: CreateTaskData) => {
		if (!task) return;
		try {
			await onSubmit(task.id, data);
			reset();
			onClose();
			toast.success("Task updated successfully!");
		} catch (err: any) {
			toast.error(err.message || "Failed to update task.");
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg w-full p-6 rounded-2xl bg-white shadow-2xl border border-gray-100">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-gray-800">Edit Task</DialogTitle>
					<DialogClose asChild>
						<Button variant="ghost" size="icon" className="absolute right-4 top-4 hover:bg-gray-100 rounded-full">
							<X className="h-5 w-5 text-gray-600" />
						</Button>
					</DialogClose>
				</DialogHeader>
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
								Target Count
							</Label>
							<Input id="targetCount" type="number" placeholder="e.g., 1" className="mt-1 rounded-lg" {...register("targetCount", { valueAsNumber: true })} />
							{errors.targetCount && <p className="text-red-500 text-sm mt-2">{errors.targetCount.message}</p>}
						</div>
					</div>
					<div>
						<Label htmlFor="actionType" className="text-sm font-medium text-gray-700">
							Action Type
						</Label>
						<Controller
							name="actionType"
							control={control}
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="mt-1 rounded-lg px-3 py-2 text-gray-700">
										<SelectValue placeholder="Select an action type" />
									</SelectTrigger>
									<SelectContent>
										{actionTypes.length === 0 ? (
											<div className="text-gray-500 p-2">No action types available</div>
										) : (
											actionTypes.map((type) => (
												<SelectItem key={type.id} value={type.id}>
													{type.label}
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
							)}
						/>
						{errors.actionType && <p className="text-red-500 text-sm mt-2">{errors.actionType.message}</p>}
					</div>
					<div className="flex justify-end space-x-3 pt-4">
						<Button type="button" variant="outline" onClick={onClose} className="rounded-lg border-gray-300 hover:bg-gray-50">
							Cancel
						</Button>
						<Button type="submit">Update Task</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

// Create Task Form Component
const CreateTaskForm = ({ onTaskCreated }: { onTaskCreated: () => void }) => {
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
										Target Count
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
															<SelectItem key={type.id} value={type.id}>
																{type.label}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
										)}
									/>
									<Button type="button" variant="outline" onClick={() => setIsActionTypeDialogOpen(true)} className="rounded-lg border-gray-300 hover:bg-gray-50">
										<Plus className="h-4 w-4 mr-2" />
										Add New
									</Button>
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

// Task List Component
interface TaskListProps {
	refreshTrigger: number;
}

const TaskList = ({ refreshTrigger }: TaskListProps) => {
	const [tasks, setTasks] = useState<GamificationTask[]>([]);
	const [actionTypes, setActionTypes] = useState<CreateActionTypeData[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<GamificationTask | null>(null);

	// Fetch tasks and action types on mount and when refreshTrigger or page changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [tasksResponse, actionTypesResponse] = await Promise.all([
					getAllGamificationTasksAdminAPI(pagination.page, pagination.limit),
					getActionTypesAdminAPI(),
				]);
				if (tasksResponse.success) {
					setTasks(tasksResponse.tasks);
					setPagination((prev) => ({
						...prev,
						total: tasksResponse.total,
						totalPages: Math.ceil(tasksResponse.total / prev.limit),
					}));
				}
				setActionTypes(actionTypesResponse);
			} catch (err: any) {
				toast.error(err.message || "Failed to load data.");
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [refreshTrigger, pagination.page]);

	// Toggle task listing status
	const handleToggleList = async (taskId: string, status: boolean) => {
		try {
			const updatedTask = await toggleTaskListStatusAdminAPI(taskId, !status);
			setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, isListed: updatedTask.isListed } : task)));
			toast.success("Task status updated successfully!");
		} catch (err: any) {
			toast.error(err.message || "Failed to toggle task status.");
		}
	};

	// Delete task
	const handleDeleteTask = async (taskId: string) => {
		try {
			await deleteGamificationTaskAdminAPI(taskId);
			setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
			setPagination((prev) => ({
				...prev,
				total: prev.total - 1,
				totalPages: Math.ceil((prev.total - 1) / prev.limit),
				page: Math.min(prev.page, Math.ceil((prev.total - 1) / prev.limit) || 1),
			}));
			toast.success("Task deleted successfully!");
		} catch (err: any) {
			toast.error(err.message || "Failed to delete task.");
		}
	};

	// Edit task
	const handleEditTask = async (taskId: string, data: CreateTaskData) => {
		try {
			const updatedTask = await updateGamificationTaskAdminAPI(taskId, {
				title: data.title,
				xpReward: Number(data.xpReward),
				targetCount: Number(data.targetCount),
				actionType: data.actionType,
			});
			setTasks((prevTasks) =>
				prevTasks.map((task) =>
					task.id === taskId ? { ...task, ...updatedTask } : task
				)
			);
		} catch (err: any) {
			throw err;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			setPagination((prev) => ({ ...prev, page: newPage }));
		}
	};

	if (isLoading) {
		return <div className="text-center py-4">Loading tasks...</div>;
	}

	return (
		<Card>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-800">Gamification Tasks</h2>
					<span className="text-sm text-gray-500">
						Showing {tasks.length} of {pagination.total} tasks
					</span>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{tasks.length === 0 ? (
					<div className="text-center py-12">
						<Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-600 text-lg">No tasks found. Create your first task above!</p>
					</div>
				) : (
					<>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="border-b border-gray-200">
										<TableHead className="text-gray-700 font-semibold">Title</TableHead>
										<TableHead className="text-gray-700 font-semibold">XP Reward</TableHead>
										<TableHead className="text-gray-700 font-semibold">Target Count</TableHead>
										<TableHead className="text-gray-700 font-semibold">Action Type</TableHead>
										<TableHead className="text-gray-700 font-semibold">Created At</TableHead>
										<TableHead className="text-gray-700 font-semibold">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tasks.map((task) => (
										<TableRow key={task.id} className="hover:bg-gray-50 transition-colors duration-200">
											<TableCell className="font-medium text-gray-800">{task.title}</TableCell>
											<TableCell>
												<span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">{task.xpReward} XP</span>
											</TableCell>
											<TableCell className="text-gray-600">{task.targetCount}</TableCell>
											<TableCell>
												<span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">{task.actionType}</span>
											</TableCell>
											<TableCell className="text-gray-500">{formatDate(task.createdAt)}</TableCell>
											<TableCell>
												<div className="flex space-x-2">
													<Button
														variant="ghost"
														size="icon"
														onClick={() => {
															setSelectedTask(task);
															setIsEditDialogOpen(true);
														}}
														className="hover:bg-blue-100 rounded-full"
														title="Edit Task"
													>
														<Edit className="h-4 w-4 text-blue-600" />
													</Button>
													<Button variant="ghost" size="icon" onClick={() => handleToggleList(task.id, task.isListed)} className="hover:bg-gray-100 rounded-full" title={task.isListed ? "Unlist Task" : "List Task"}>
														{task.isListed ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
													</Button>
													<Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="hover:bg-red-100 rounded-full" title="Delete Task">
														<Trash2 className="h-4 w-4 text-red-600" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
						{pagination.totalPages > 1 && (
							<div className="flex items-center justify-between mt-6">
								<div className="text-sm text-gray-500">
									Page {pagination.page} of {pagination.totalPages}
								</div>
								<div className="flex space-x-3">
									<Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1} className="rounded-lg border-gray-300 hover:bg-gray-50">
										<ChevronLeft className="h-4 w-4 mr-1" />
										Previous
									</Button>
									<Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages} className="rounded-lg border-gray-300 hover:bg-gray-50">
										Next
										<ChevronRight className="h-4 w-4 ml-1" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
				<EditTaskDialog
					isOpen={isEditDialogOpen}
					onClose={() => {
						setIsEditDialogOpen(false);
						setSelectedTask(null);
					}}
					task={selectedTask}
					actionTypes={actionTypes}
					onSubmit={handleEditTask}
				/>
			</CardContent>
		</Card>
	);
};

// Main Admin Gamification Page
export default function AdminGamificationPage() {
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	const handleTaskCreated = () => {
		setRefreshTrigger((prev) => prev + 1);
	};

	return (
		<div className="min-h-screen">
			<div className="space-y-8">
				<CreateTaskForm onTaskCreated={handleTaskCreated} />
				<TaskList refreshTrigger={refreshTrigger} />
			</div>
		</div>
	);
}