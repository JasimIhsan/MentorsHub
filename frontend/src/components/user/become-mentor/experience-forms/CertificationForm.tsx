import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CertificationFormData {
	certification: string;
	issuingOrg: string;
	issueDate: string;
	expiryDate?: string;
}

interface CertificationFormProps {
	id: string;
	onValidChange: (isValid: boolean) => void;
}

export function CertificationForm({ id, onValidChange }: CertificationFormProps) {
	const {
		register,
		formState: { errors, isValid },
	} = useForm<CertificationFormData>({
		mode: "onChange",
		defaultValues: {
			certification: "",
			issuingOrg: "",
			issueDate: "",
			expiryDate: "",
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
					<Label htmlFor={`certification-${id}`}>Certification Name</Label>
					<Input id={`certification-${id}`} placeholder="e.g. AWS Certified Solutions Architect" {...register("certification", { required: "Certification name is required" })} />
					{errors.certification && <p className="text-red-500 text-sm">{errors.certification.message}</p>}
				</div>

				<div className="space-y-2">
					<Label htmlFor={`issuing-org-${id}`}>Issuing Organization</Label>
					<Input id={`issuing-org-${id}`} placeholder="e.g. Amazon Web Services" {...register("issuingOrg", { required: "Issuing organization is required" })} />
					{errors.issuingOrg && <p className="text-red-500 text-sm">{errors.issuingOrg.message}</p>}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor={`issue-date-${id}`}>Issue Date</Label>
						<Input id={`issue-date-${id}`} type="month" {...register("issueDate", { required: "Issue date is required" })} />
						{errors.issueDate && <p className="text-red-500 text-sm">{errors.issueDate.message}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`expiry-date-${id}`}>Expiry Date (if applicable)</Label>
						<Input id={`expiry-date-${id}`} type="month" {...register("expiryDate")} />
					</div>
				</div>
			</div>
		</div>
	);
}
