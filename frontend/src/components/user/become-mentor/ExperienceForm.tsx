// src/components/mentor-application/ExperienceForm.tsx
import { Separator } from "@/components/ui/separator";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { EducationSection } from "./EducationSection";
import { CertificationSection } from "./CertificationSection";
import { MentorApplicationFormData, FormErrors } from "@/types/mentor.application";

interface ExperienceFormProps {
	formData: MentorApplicationFormData;
	formErrors: FormErrors;
	handleNestedChange: (field: "workExperiences" | "educations" | "certifications", index: number, subField: string, value: any) => void;
	handleAddNested: (field: "workExperiences" | "educations" | "certifications") => void;
	handleRemoveNested: (field: "workExperiences" | "educations" | "certifications", index: number) => void;
}

export function ExperienceForm({ formData, formErrors, handleNestedChange, handleAddNested, handleRemoveNested }: ExperienceFormProps) {
	return (
		<div className="space-y-8">
			<WorkExperienceSection workExperiences={formData.workExperiences} formErrors={formErrors} handleNestedChange={handleNestedChange} handleAddNested={handleAddNested} handleRemoveNested={handleRemoveNested} />
			<Separator className="my-4" />
			<EducationSection educations={formData.educations} formErrors={formErrors} handleNestedChange={handleNestedChange} handleAddNested={handleAddNested} handleRemoveNested={handleRemoveNested} />
			<Separator className="my-4" />
			<CertificationSection certifications={formData.certifications} formErrors={formErrors} handleNestedChange={handleNestedChange} handleAddNested={handleAddNested} handleRemoveNested={handleRemoveNested} />
		</div>
	);
}
