import { useState } from "react";
import { CreateTaskForm } from "@/components/admin/gamification/CreateTaskForm";
import { TaskList } from "@/components/admin/gamification/TaskList";

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
