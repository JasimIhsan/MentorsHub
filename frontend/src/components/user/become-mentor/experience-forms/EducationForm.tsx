import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EducationFormData {
	degree: string;
	institution: string;
	startYear: string;
	endYear: string;
}

interface EducationFormProps {
	id: string;
	onValidChange: (isValid: boolean) => void;
}

export function EducationForm({ id, onValidChange }: EducationFormProps) {
	const {
		register,
		formState: { errors, isValid },
	} = useForm<EducationFormData>({
		mode: "onChange",
		defaultValues: {
			degree: "",
			institution: "",
			startYear: "",
			endYear: "",
		},
	});

	// Update validity state
	useEffect(() => {
		onValidChange(isValid);
	}, [isValid, onValidChange]);

	return (
		<div className="space-y-4">
			<div className="rounded-lg border p-4 space-y-4">
				<div className="space-y-2">
					<Label htmlFor={`degree-${id}`}>Degree</Label>
					<Input id={`degree-${id}`} placeholder="e.g. Bachelor of Science in Computer Science" {...register("degree", { required: "Degree is required" })} />
					{errors.degree && <p className="text-red-500 text-sm">{errors.degree.message}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor={`institution-${id}`}>Institution</Label>
					<Input id={`institution-${id}`} placeholder="e.g. Stanford University" {...register("institution", { required: "Institution is required" })} />
					{errors.institution && <p className="text-red-500 text-sm">{errors.institution.message}</p>}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor={`edu-start-date-${id}`}>Start Year</Label>
						<Input
							id={`edu-start-date-${id}`}
							type="number"
							placeholder="e.g. 2015"
							{...register("startYear", {
								required: "Start year is required",
								min: { value: 1900, message: "Year must be after 1900" },
								max: { value: new Date().getFullYear(), message: "Year cannot be in the future" },
							})}
						/>
						{errors.startYear && <p className="text-red-500 text-sm">{errors.startYear.message}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`edu-end-date-${id}`}>End Year</Label>
						<Input
							id={`edu-end-date-${id}`}
							type="number"
							placeholder="e.g. 2019"
							{...register("endYear", {
								required: "End year is required",
								min: { value: 1900, message: "Year must be after 1900" },
								max: { value: new Date().getFullYear(), message: "Year cannot be in the future" },
							})}
						/>
						{errors.endYear && <p className="text-red-500 text-sm">{errors.endYear.message}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
