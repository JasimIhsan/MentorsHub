// src/components/mentor-application/CertificationSection.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus, X } from "lucide-react";
import { Certification, FormErrors } from "@/types/mentor.application";

interface CertificationSectionProps {
	certifications: Certification[];
	formErrors: FormErrors;
	handleNestedChange: (field: "certifications", index: number, subField: string, value: any) => void;
	handleAddNested: (field: "certifications") => void;
	handleRemoveNested: (field: "certifications", index: number) => void;
}

export function CertificationSection({ certifications, formErrors, handleNestedChange, handleAddNested, handleRemoveNested }: CertificationSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<BookOpen className="h-5 w-5 text-primary" />
				<h3 className="font-medium text-base sm:text-lg">Certifications</h3>
			</div>
			{certifications.map((cert, index) => (
				<div key={index} className="rounded-lg border p-4 space-y-4 relative">
					<div className="space-y-2">
						<Label htmlFor={`certification-${index}`}>Certification Name</Label>
						<Input
							id={`certification-${index}`}
							value={cert.name}
							onChange={(e) => handleNestedChange("certifications", index, "name", e.target.value)}
							placeholder="e.g. AWS Certified Solutions Architect"
							className={formErrors[`certifications[${index}].name`] ? "border-red-500" : ""}
						/>
						{formErrors[`certifications[${index}].name`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].name`]}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`issuing-org-${index}`}>Issuing Organization</Label>
						<Input
							id={`issuing-org-${index}`}
							value={cert.issuingOrg}
							onChange={(e) => handleNestedChange("certifications", index, "issuingOrg", e.target.value)}
							placeholder="e.g. Amazon Web Services"
							className={formErrors[`certifications[${index}].issuingOrg`] ? "border-red-500" : ""}
						/>
						{formErrors[`certifications[${index}].issuingOrg`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].issuingOrg`]}</p>}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={`issue-date-${index}`}>Issue Date</Label>
							<Input
								id={`issue-date-${index}`}
								type="month"
								value={cert.issueDate}
								onChange={(e) => handleNestedChange("certifications", index, "issueDate", e.target.value)}
								max={new Date().toISOString().slice(0, 7)}
								className={formErrors[`certifications[${index}].issueDate`] ? "border-red-500" : ""}
							/>
							{formErrors[`certifications[${index}].issueDate`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].issueDate`]}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor={`expiry-date-${index}`}>Expiry Date (if applicable)</Label>
							<Input
								id={`expiry-date-${index}`}
								type="month"
								value={cert.expiryDate}
								onChange={(e) => handleNestedChange("certifications", index, "expiryDate", e.target.value)}
								className={formErrors[`certifications[${index}].expiryDate`] ? "border-red-500" : ""}
							/>
							{formErrors[`certifications[${index}].expiryDate`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].expiryDate`]}</p>}
						</div>
					</div>
					{certifications.length > 1 && (
						<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveNested("certifications", index)}>
							<X className="h-4 w-4" />
							<span className="sr-only">Remove Certification</span>
						</Button>
					)}
				</div>
			))}
			<Button variant="outline" className="w-full" onClick={() => handleAddNested("certifications")}>
				<Plus className="mr-2 h-4 w-4" />
				Add Another Certification
			</Button>
		</div>
	);
}
