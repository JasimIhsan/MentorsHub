import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WorkExperienceFormData {
	jobTitle: string;
	company: string;
	startDate: string;
	endDate?: string;
	currentJob: boolean;
	description: string;
}

interface WorkExperienceFormProps {
	id: string;
	onValidChange: (isValid: boolean) => void;
}

export function WorkExperienceForm({ id, onValidChange }: WorkExperienceFormProps) {
	const {
		register,
		formState: { errors, isValid },
		watch,
		setValue,
	} = useForm<WorkExperienceFormData>({
		mode: "onChange",
		defaultValues: {
			jobTitle: "",
			company: "",
			startDate: "",
			endDate: "",
			currentJob: false,
			description: "",
		},
	});

	const currentJob = watch("currentJob");

	// Update validity state
	useEffect(() => {
		onValidChange(isValid);
	}, [isValid, onValidChange]);

	// Clear endDate if currentJob is checked
	useEffect(() => {
		if (currentJob) {
			setValue("endDate", "");
		}
	}, [currentJob, setValue]);

	return (
		<div className="space-y-4">
			<div className="rounded-lg border p-4 space-y-4">
				<div className="space-y-2">
					<Label htmlFor={`job-title-${id}`}>Job Title</Label>
					<Input id={`job-title-${id}`} placeholder="e.g. Senior Software Engineer" {...register("jobTitle", { required: "Job title is required" })} />
					{errors.jobTitle && <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor={`company-${id}`}>Company</Label>
					<Input id={`company-${id}`} placeholder="e.g. Acme Inc." {...register("company", { required: "Company is required" })} />
					{errors.company && <p className="text-red-500 text-sm">{errors.company.message}</p>}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor={`start-date-${id}`}>Start Date</Label>
						<Input id={`start-date-${id}`} type="month" {...register("startDate", { required: "Start date is required" })} />
						{errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`end-date-${id}`}>End Date</Label>
						<Input
							id={`end-date-${id}`}
							type="month"
							disabled={currentJob}
							{...register("endDate", {
								required: currentJob ? false : "End date is required unless currently working",
							})}
						/>
						{errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
						<div className="flex items-center space-x-2 mt-1">
							<Checkbox id={`current-job-${id}`} {...register("currentJob")} />
							<Label htmlFor={`current-job-${id}`} className="text-sm font-normal">
								I currently work here
							</Label>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor={`job-description-${id}`}>Description</Label>
					<Textarea id={`job-description-${id}`} placeholder="Describe your responsibilities and achievements..." {...register("description", { required: "Description is required" })} />
					{errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
				</div>
			</div>
		</div>
	);
}
