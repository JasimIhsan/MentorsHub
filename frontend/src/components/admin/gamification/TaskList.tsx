import { getAllGamificationTasksAdminAPI, getActionTypesAdminAPI, toggleTaskListStatusAdminAPI, deleteGamificationTaskAdminAPI, updateGamificationTaskAdminAPI } from "@/api/gamification.api.service";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { GamificationTask, CreateActionTypeData, CreateTaskData } from "@/interfaces/gamification.interface";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { Search, Gamepad2, Edit, EyeOff, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { EditTaskDialog } from "./EditTaskModal";
import { Button } from "@/components/ui/button";

// Task List Component
interface TaskListProps {
	refreshTrigger: number;
}

export const TaskList = ({ refreshTrigger }: TaskListProps) => {
	const [_searchParams, setSearchParams] = useSearchParams();
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
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchTerm = useDebounce(searchQuery, 1000);
	const [selectedActionType, setSelectedActionType] = useState("");

	useEffect(() => {
		const params = new URLSearchParams();
		if (pagination.page > 1) params.set("page", pagination.page.toString());
		if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
		if (selectedActionType !== "all") params.set("actionType", selectedActionType);
		setSearchParams(params, { replace: true });
	}, [debouncedSearchTerm, selectedActionType]);

	// Fetch tasks and action types on mount and when refreshTrigger, page, searchQuery, or selectedActionType changes
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const [tasksResponse, actionTypesResponse] = await Promise.all([getAllGamificationTasksAdminAPI(pagination.page, pagination.limit, selectedActionType || undefined, debouncedSearchTerm || undefined), getActionTypesAdminAPI()]);
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
	}, [refreshTrigger, pagination.page, debouncedSearchTerm, selectedActionType]);

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
			setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedTask } : task)));
			toast.success("Task updated successfully!");
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
				<div className="flex space-x-4 mt-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input placeholder="Search tasks by title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 rounded-lg" />
						</div>
					</div>
					<div className="w-48">
						<Select value={selectedActionType} onValueChange={setSelectedActionType}>
							<SelectTrigger className="rounded-lg px-3 py-2 text-gray-700">
								<SelectValue placeholder="Filter by action type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Action Types</SelectItem>
								{actionTypes.map((type) => (
									<SelectItem key={type.id} value={type.id || "default"}>
										{type.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				{tasks.length === 0 ? (
					<div className="text-center py-12">
						<Gamepad2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-600 text-lg">No tasks found. Try adjusting your search or filter.</p>
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
														title="Edit Task">
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
