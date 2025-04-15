// src/components/mentor-application/WorkExperienceSection.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BriefcaseBusiness, Plus, X } from "lucide-react";
import { WorkExperience, FormErrors } from "@/types/mentor.application";

interface WorkExperienceSectionProps {
	workExperiences: WorkExperience[];
	formErrors: FormErrors;
	handleNestedChange: (field: "workExperiences", index: number, subField: string, value: any) => void;
	handleAddNested: (field: "workExperiences") => void;
	handleRemoveNested: (field: "workExperiences", index: number) => void;
}

export function WorkExperienceSection({ workExperiences, formErrors, handleNestedChange, handleAddNested, handleRemoveNested }: WorkExperienceSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<BriefcaseBusiness className="h-5 w-5 text-primary" />
				<h3 className="font-medium text-base sm:text-lg">Work Experience</h3>
			</div>
			{workExperiences.map((exp, index) => (
				<div key={index} className="rounded-lg border p-4 space-y-4 relative">
					<div className="space-y-2">
						<Label htmlFor={`job-title-${index}`}>Job Title</Label>
						<Input
							id={`job-title-${index}`}
							value={exp.jobTitle}
							onChange={(e) => handleNestedChange("workExperiences", index, "jobTitle", e.target.value)}
							placeholder="e.g. Senior Software Engineer"
							className={formErrors[`workExperiences[${index}].jobTitle`] ? "border-red-500" : ""}
						/>
						{formErrors[`workExperiences[${index}].jobTitle`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].jobTitle`]}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`company-${index}`}>Company</Label>
						<Input
							id={`company-${index}`}
							value={exp.company}
							onChange={(e) => handleNestedChange("workExperiences", index, "company", e.target.value)}
							placeholder="e.g. Acme Inc."
							className={formErrors[`workExperiences[${index}].company`] ? "border-red-500" : ""}
						/>
						{formErrors[`workExperiences[${index}].company`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].company`]}</p>}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={`start-date-${index}`}>Start Date</Label>
							<Input
								id={`start-date-${index}`}
								type="month"
								value={exp.startDate}
								onChange={(e) => handleNestedChange("workExperiences", index, "startDate", e.target.value)}
								max={new Date().toISOString().slice(0, 7)}
								className={formErrors[`workExperiences[${index}].startDate`] ? "border-red-500" : ""}
							/>
							{formErrors[`workExperiences[${index}].startDate`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].startDate`]}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor={`end-date-${index}`}>End Date</Label>
							<Input
								id={`end-date-${index}`}
								type="month"
								value={exp.endDate}
								disabled={exp.currentJob}
								onChange={(e) => handleNestedChange("workExperiences", index, "endDate", e.target.value)}
								max={new Date().toISOString().slice(0, 7)}
								className={formErrors[`workExperiences[${index}].endDate`] ? "border-red-500" : ""}
							/>
							{formErrors[`workExperiences[${index}].endDate`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].endDate`]}</p>}
							<div className="flex items-center space-x-2 mt-1">
								<Checkbox id={`current-job-${index}`} checked={exp.currentJob} onCheckedChange={(checked) => handleNestedChange("workExperiences", index, "currentJob", !!checked)} />
								<Label htmlFor={`current-job-${index}`} className="text-sm font-normal">
									I currently work here
								</Label>
							</div>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor={`job-description-${index}`}>Description</Label>
						<Textarea
							id={`job-description-${index}`}
							value={exp.description}
							onChange={(e) => handleNestedChange("workExperiences", index, "description", e.target.value)}
							placeholder="Describe your responsibilities and achievements..."
							className={formErrors[`workExperiences[${index}].description`] ? "border-red-500" : ""}
						/>
						{formErrors[`workExperiences[${index}].description`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].description`]}</p>}
					</div>
					{workExperiences.length > 1 && (
						<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveNested("workExperiences", index)}>
							<X className="h-4 w-4" />
							<span className="sr-only">Remove Experience</span>
						</Button>
					)}
				</div>
			))}
			<Button variant="outline" className="w-full" onClick={() => handleAddNested("workExperiences")}>
				<Plus className="mr-2 h-4 w-4" />
				Add Another Work Experience
			</Button>
		</div>
	);
}
