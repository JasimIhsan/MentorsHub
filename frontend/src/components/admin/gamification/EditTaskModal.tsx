import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GamificationTask, CreateActionTypeData, CreateTaskData } from "@/interfaces/gamification.interface";
import { taskSchema } from "@/schema/gamification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Edit Task Dialog Component
interface EditTaskDialogProps {
	isOpen: boolean;
	onClose: () => void;
	task: GamificationTask | null;
	actionTypes: CreateActionTypeData[];
	onSubmit: (taskId: string, data: CreateTaskData) => void;
}

export const EditTaskDialog = ({ isOpen, onClose, task, actionTypes, onSubmit }: EditTaskDialogProps) => {
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
												<SelectItem key={type.id} value={type.id || "default"}>
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
