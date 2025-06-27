import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, Trophy, Target, CheckCircle, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchListedGamificationTasks } from "@/api/gamification.api.service";
import { useDebounce } from "@/hooks/useDebounce";

// Define TaskWithProgress interface
export interface TaskWithProgress {
	id: string;
	title: string;
	xpReward: number;
	targetCount: number;
	actionType: string;
	progress: number;
	isCompleted: boolean;
	icon: string;
}

// Define UserStats interface
export interface UserStats {
	totalXP: number;
	level: number;
	tasksCompleted: number;
	xpToNextLevel: number;
}

// Mock user stats data
const mockUserStats: UserStats = {
	totalXP: 45750,
	level: 12,
	tasksCompleted: 23,
	xpToNextLevel: 4250,
};

// Define category colors

// TaskCard component
interface TaskCardProps {
	task: TaskWithProgress;
	index: number;
}

function TaskCard({ task, index }: TaskCardProps) {
	const progressPercentage = (task.progress / task.targetCount) * 100;

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.3 }} whileHover={{ scale: 1.02, y: -2 }} className="relative">
			<div className={`relative bg-white rounded-xl border-2 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${task.isCompleted ? "border-green-200 bg-green-50/50" : "border-gray-200 hover:border-gray-300"}`}>
				{task.isCompleted && (
					<motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
						<CheckCircle className="w-3 h-3" aria-hidden="true" />
						Completed!
					</motion.div>
				)}
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<div>
							<h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
						</div>
					</div>
				</div>
				<div className="mb-4">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium text-gray-700">
							Progress: {task.progress}/{task.targetCount}
						</span>
						<span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
					</div>
					<Progress value={progressPercentage} className={`h-2 ${task.isCompleted ? "[&>div]:bg-green-500" : ""}`} aria-label={`Progress for ${task.title}`} />
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Zap className="w-4 h-4 text-yellow-500" aria-hidden="true" />
						<span className="font-semibold text-gray-900">+{task.xpReward.toLocaleString()} XP</span>
					</div>
				</div>
				{task.isCompleted && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-green-500/10 rounded-xl flex items-center justify-center" />}
			</div>
		</motion.div>
	);
}

// UserStats component
interface UserStatsProps {
	stats: UserStats;
}

function UserStats({ stats }: UserStatsProps) {
	const levelProgress = ((stats.totalXP % stats.xpToNextLevel) / stats.xpToNextLevel) * 100;

	return (
		<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-8">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="text-center">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Zap className="w-6 h-6 text-yellow-300" aria-hidden="true" />
						<span className="text-sm font-medium opacity-90">Total XP</span>
					</div>
					<div className="text-3xl font-bold">{stats.totalXP.toLocaleString()}</div>
				</div>
				<div className="text-center">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Trophy className="w-6 h-6 text-yellow-300" aria-hidden="true" />
						<span className="text-sm font-medium opacity-90">Level</span>
					</div>
					<div className="text-3xl font-bold">{stats.level}</div>
					<div className="mt-2">
						<Progress value={levelProgress} className="h-2 bg-white/20 [&>div]:bg-yellow-300" aria-label="Level progress" />
						<div className="text-xs opacity-75 mt-1">{stats.xpToNextLevel.toLocaleString()} XP to next level</div>
					</div>
				</div>
				<div className="text-center">
					<div className="flex items-center justify-center gap-2 mb-2">
						<Target className="w-6 h-6 text-green-300" aria-hidden="true" />
						<span className="text-sm font-medium opacity-90">Completed</span>
					</div>
					<div className="text-3xl font-bold">{stats.tasksCompleted}</div>
					<Badge variant="secondary" className="mt-1 bg-white/20 text-white border-white/30">
						Tasks
					</Badge>
				</div>
			</div>
		</motion.div>
	);
}

// GamificationDashboard component
export default function GamificationPage() {
	const [tasks, setTasks] = useState<TaskWithProgress[]>([]);
	const [userStats, setUserStats] = useState<UserStats>(mockUserStats);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [filter, setFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [itemsPerPage] = useState(9); // 3x3 grid
	const userId = useSelector((state: RootState) => state.userAuth.user?.id);
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);

	// Fetch tasks from server
	const fetchTasks = async (page: number = 1) => {
		setIsRefreshing(true);
		try {
			const response = await fetchListedGamificationTasks(userId!, debouncedSearchTerm, page, itemsPerPage);

			if (response.success) {
				setTasks(response.tasks);
				setTotalPages(Math.ceil(response.totalCount / itemsPerPage));
				setCurrentPage(page);
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		} finally {
			setIsRefreshing(false);
		}
	};

	// Fetch tasks on component mount or when dependencies change
	useEffect(() => {
		fetchTasks(currentPage);
	}, [userId, filter, debouncedSearchTerm, currentPage]);

	// Check for newly completed tasks
	useEffect(() => {
		const newlyCompleted = tasks.filter((task) => task.progress >= task.targetCount && !task.isCompleted);

		if (newlyCompleted.length > 0) {
			newlyCompleted.forEach((task) => {
				toast.success(`🎉 Task Completed!`, {
					description: `"${task.title}" - You earned ${task.xpReward} XP!`,
					duration: 4000,
				});
			});

			setTasks((prev) => prev.map((task) => (newlyCompleted.some((completed) => completed.id === task.id) ? { ...task, isCompleted: true } : task)));

			const newXP = newlyCompleted.reduce((sum, task) => sum + task.xpReward, 0);
			setUserStats((prev) => ({
				...prev,
				totalXP: prev.totalXP + newXP,
				tasksCompleted: prev.tasksCompleted + newlyCompleted.length,
			}));
		}
	}, [tasks]);

	// Handle refresh
	const handleRefresh = async () => {
		await fetchTasks(currentPage);
	};

	// Handle page change
	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	// Filter tasks based on category and search
	const filteredTasks = tasks.filter((task) => {
		const matchesFilter = filter === "all" || task.isCompleted === (filter === "completed");
		const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	// Define task categories
	const categories = [
		{ value: "all", label: "All Tasks", count: tasks.length },
		{
			value: "on track",
			label: "On Track",
			count: tasks.filter((t) => t.isCompleted === false).length,
		},
		{
			value: "completed",
			label: "Completed",
			count: tasks.filter((t) => t.isCompleted === true).length,
		},
	];

	return (
		<div className="min-h-screen px-10 md:px-20 xl:px-25 w-full py-6">
			<div className="w-full">
				<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Gamification Hub</h1>
					<p className="text-gray-600">Complete tasks, earn XP, and level up your skills!</p>
				</motion.div>

				<UserStats stats={userStats} />

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row gap-4 mb-8">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" aria-hidden="true" />
						<Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" aria-label="Search tasks" />
					</div>
					<div className="flex gap-2 flex-wrap">
						{categories.map((category) => (
							<Button key={category.value} variant={filter === category.value ? "default" : "outline"} size="sm" onClick={() => setFilter(category.value)} className="flex items-center gap-2" aria-pressed={filter === category.value}>
								{category.label}
								<Badge variant="secondary" className="text-xs">
									{category.count}
								</Badge>
							</Button>
						))}
					</div>
					<Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="flex items-center gap-2 bg-transparent" aria-label="Refresh tasks">
						<RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
						Refresh
					</Button>
				</motion.div>

				<AnimatePresence mode="wait">
					<motion.div key={filter + searchTerm + currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredTasks.map((task, index) => (
							<TaskCard key={task.id} task={task} index={index} />
						))}
					</motion.div>
				</AnimatePresence>

				{filteredTasks.length === 0 && (
					<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
						<div className="text-6xl mb-4">🎯</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks found</h3>
						<p className="text-gray-600">Try adjusting your search or filter criteria.</p>
					</motion.div>
				)}

				{totalPages > 1 && (
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mt-8">
						<div className="text-sm text-gray-600">
							Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, tasks.length)} of {tasks.length} tasks
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
								Previous
							</Button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
								<Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => handlePageChange(page)} aria-label={`Go to page ${page}`}>
									{page}
								</Button>
							))}
							<Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
								Next
							</Button>
						</div>
					</motion.div>
				)}
			</div>
		</div>
	);
}
