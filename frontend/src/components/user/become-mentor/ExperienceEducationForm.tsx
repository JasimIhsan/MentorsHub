import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BriefcaseBusiness, GraduationCap, BookOpen, Plus } from "lucide-react";
import { WorkExperienceForm } from "@/components/user/become-mentor/experience-forms/WorkExperieceForm";
import { EducationForm } from "@/components/user/become-mentor/experience-forms/EducationForm";
import { CertificationForm } from "@/components/user/become-mentor/experience-forms/CertificationForm";

export default function ExperienceEducationForm() {
	// State to track multiple form instances
	const [workExperiences, setWorkExperiences] = useState<string[]>([crypto.randomUUID()]);
	const [educations, setEducations] = useState<string[]>([crypto.randomUUID()]);
	const [certifications, setCertifications] = useState<string[]>([crypto.randomUUID()]);

	// State to track form validity
	const [workExperienceValid, setWorkExperienceValid] = useState<Record<string, boolean>>({});
	const [educationValid, setEducationValid] = useState<Record<string, boolean>>({});
	const [certificationValid, setCertificationValid] = useState<Record<string, boolean>>({});

	// Handlers to add new forms
	const addWorkExperience = () => {
		if (Object.values(workExperienceValid).every((isValid) => isValid)) {
			setWorkExperiences([...workExperiences, crypto.randomUUID()]);
		}
	};

	const addEducation = () => {
		if (Object.values(educationValid).every((isValid) => isValid)) {
			setEducations([...educations, crypto.randomUUID()]);
		}
	};

	const addCertification = () => {
		if (Object.values(certificationValid).every((isValid) => isValid)) {
			setCertifications([...certifications, crypto.randomUUID()]);
		}
	};

	// Handlers to update form validity
	const handleWorkExperienceValid = (id: string, isValid: boolean) => {
		setWorkExperienceValid((prev) => ({ ...prev, [id]: isValid }));
	};

	const handleEducationValid = (id: string, isValid: boolean) => {
		setEducationValid((prev) => ({ ...prev, [id]: isValid }));
	};

	const handleCertificationValid = (id: string, isValid: boolean) => {
		setCertificationValid((prev) => ({ ...prev, [id]: isValid }));
	};

	return (
		<div className="space-y-8">
			{/* Work Experience Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<BriefcaseBusiness className="h-5 w-5 text-primary" />
					<h3 className="font-medium text-lg">Work Experience</h3>
				</div>
				{workExperiences.map((id) => (
					<WorkExperienceForm key={id} id={id} onValidChange={(isValid) => handleWorkExperienceValid(id, isValid)} />
				))}
				<Button type="button" variant="outline" className="w-full" onClick={addWorkExperience} disabled={!Object.values(workExperienceValid).every((isValid) => isValid)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Another Work Experience
				</Button>
			</div>

			<Separator />

			{/* Education Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<GraduationCap className="h-5 w-5 text-primary" />
					<h3 className="font-medium text-lg">Education</h3>
				</div>
				{educations.map((id) => (
					<EducationForm key={id} id={id} onValidChange={(isValid) => handleEducationValid(id, isValid)} />
				))}
				<Button type="button" variant="outline" className="w-full" onClick={addEducation} disabled={!Object.values(educationValid).every((isValid) => isValid)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Another Education
				</Button>
			</div>

			<Separator />

			{/* Certifications Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<BookOpen className="h-5 w-5 text-primary" />
					<h3 className="font-medium text-lg">Certifications</h3>
				</div>
				{certifications.map((id) => (
					<CertificationForm key={id} id={id} onValidChange={(isValid) => handleCertificationValid(id, isValid)} />
				))}
				<Button type="button" variant="outline" className="w-full" onClick={addCertification} disabled={!Object.values(certificationValid).every((isValid) => isValid)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Another Certification
				</Button>
			</div>
		</div>
	);
}
