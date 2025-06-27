import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGamificationAPI } from "@/hooks/useGamification";
import { GamificationTask } from "@/interfaces/gamification";

interface TaskListProps {
	refreshTrigger: number;
}

export const TaskList = ({ refreshTrigger }: TaskListProps) => {
	const [tasks, setTasks] = useState<GamificationTask[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});

	const { loading, error, fetchTasks } = useGamificationAPI();

	useEffect(() => {
		loadTasks(pagination.page);
	}, [refreshTrigger]);

	const loadTasks = async (page: number) => {
		const response = await fetchTasks(page, pagination.limit);
		if (response) {
			setTasks(response.data);
			setPagination({
				page: response.page,
				limit: response.limit,
				total: response.total,
				totalPages: response.totalPages,
			});
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			loadTasks(newPage);
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

	if (loading && tasks.length === 0) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
						<p className="text-gray-600">Loading tasks...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Gamification Tasks</CardTitle>
				<p className="text-sm text-gray-600">
					Showing {tasks.length} of {pagination.total} tasks
				</p>
			</CardHeader>
			<CardContent>
				{error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				{tasks.length === 0 ? (
					<div className="text-center py-8">
						<p className="text-gray-600">No tasks found. Create your first task above!</p>
					</div>
				) : (
					<>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>XP Reward</TableHead>
										<TableHead>Target Count</TableHead>
										<TableHead>Action Type</TableHead>
										<TableHead>Created At</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{tasks.map((task) => (
										<TableRow key={task.id}>
											<TableCell className="font-medium">{task.title}</TableCell>
											<TableCell>
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{task.xpReward} XP</span>
											</TableCell>
											<TableCell>{task.targetCount}</TableCell>
											<TableCell>
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{task.actionType}</span>
											</TableCell>
											<TableCell className="text-gray-600">{formatDate(task.createdAt)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{pagination.totalPages > 1 && (
							<div className="flex items-center justify-between mt-6">
								<div className="text-sm text-gray-600">
									Page {pagination.page} of {pagination.totalPages}
								</div>
								<div className="flex space-x-2">
									<Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1 || loading}>
										<ChevronLeft className="h-4 w-4 mr-1" />
										Previous
									</Button>
									<Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages || loading}>
										Next
										<ChevronRight className="h-4 w-4 ml-1" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
};
