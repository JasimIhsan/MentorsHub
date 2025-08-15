import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateActionTypeData, ActionTypeFormData } from "@/interfaces/gamification.interface";
import { createActionTypeSchema } from "@/schema/gamification.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Create Action Type Dialog Component
interface CreateActionTypeDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreateActionTypeData) => void;
}

export const CreateActionTypeDialog = ({ isOpen, onClose, onSubmit }: CreateActionTypeDialogProps) => {
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
