// src/components/mentor-application/EducationSection.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, X } from "lucide-react";
import { Education, FormErrors } from "@/types/mentor.application";

interface EducationSectionProps {
	educations: Education[];
	formErrors: FormErrors;
	handleNestedChange: (field: "educations", index: number, subField: string, value: any) => void;
	handleAddNested: (field: "educations") => void;
	handleRemoveNested: (field: "educations", index: number) => void;
}

export function EducationSection({ educations, formErrors, handleNestedChange, handleAddNested, handleRemoveNested }: EducationSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<GraduationCap className="h-5 w-5 text-primary" />
				<h3 className="font-medium text-base sm:text-lg">Education</h3>
			</div>
			{educations.map((edu, index) => (
				<div key={index} className="rounded-lg border p-4 space-y-4 relative">
					<div className="space-y-2">
						<Label htmlFor={`degree-${index}`}>Degree</Label>
						<Input
							id={`degree-${index}`}
							value={edu.degree}
							onChange={(e) => handleNestedChange("educations", index, "degree", e.target.value)}
							placeholder="e.g. Bachelor of Science in Computer Science"
							className={formErrors[`educations[${index}].degree`] ? "border-red-500" : ""}
						/>
						{formErrors[`educations[${index}].degree`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].degree`]}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor={`institution-${index}`}>Institution</Label>
						<Input
							id={`institution-${index}`}
							value={edu.institution}
							onChange={(e) => handleNestedChange("educations", index, "institution", e.target.value)}
							placeholder="e.g. Stanford University"
							className={formErrors[`educations[${index}].institution`] ? "border-red-500" : ""}
						/>
						{formErrors[`educations[${index}].institution`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].institution`]}</p>}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor={`edu-start-date-${index}`}>Start Year</Label>
							<Input
								id={`edu-start-date-${index}`}
								type="number"
								value={edu.startYear}
								onChange={(e) => handleNestedChange("educations", index, "startYear", e.target.value)}
								placeholder="e.g. 2015"
								min="1900"
								max={new Date().getFullYear()}
								className={formErrors[`educations[${index}].startYear`] ? "border-red-500" : ""}
							/>
							{formErrors[`educations[${index}].startYear`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].startYear`]}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor={`edu-end-date-${index}`}>End Year</Label>
							<Input
								id={`edu-end-date-${index}`}
								type="number"
								value={edu.endYear}
								onChange={(e) => handleNestedChange("educations", index, "endYear", e.target.value)}
								placeholder="e.g. 2019"
								min="1900"
								max={new Date().getFullYear()}
								className={formErrors[`educations[${index}].endYear`] ? "border-red-500" : ""}
							/>
							{formErrors[`educations[${index}].endYear`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].endYear`]}</p>}
						</div>
					</div>
					{educations.length > 1 && (
						<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveNested("educations", index)}>
							<X className="h-4 w-4" />
							<span className="sr-only">Remove Education</span>
						</Button>
					)}
				</div>
			))}
			<Button variant="outline" className="w-full" onClick={() => handleAddNested("educations")}>
				<Plus className="mr-2 h-4 w-4" />
				Add Another Education
			</Button>
		</div>
	);
}
