import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BriefcaseBusiness, GraduationCap, BookOpen, Plus } from "lucide-react";
import { WorkExperienceForm } from "@/components/user/become-mentor/experience-forms/WorkExperieceForm";
import { EducationForm } from "@/components/user/become-mentor/experience-forms/EducationForm";
import { CertificationForm } from "@/components/user/become-mentor/experience-forms/CertificationForm";

export default function ExperienceEducationForm() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<BriefcaseBusiness className="h-5 w-5 text-primary" />
					<h3 className="font-medium text-lg">Work Experience</h3>
				</div>
				<WorkExperienceForm />
				<Button type="button" variant="outline" className="w-full">
					<Plus className="mr-2 h-4 w-4" />
					Add Another Work Experience
				</Button>
			</div>

			<Separator />

			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<GraduationCap className="h-5 w-5 text-primary" />
					<h3 className="font-medium text-lg">Education</h3>
				</div>
				<EducationForm />
				<Button type="button" variant="outline" className="w-full">
					<Plus className="mr-2 h-4 w-4" />
					Add Another Education
				</Button>
			</div>

			<Separator />

			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<BookOpen className="h-5 w-5 text-primary" />
					<h3 className="font-medium text-lg">Certifications</h3>
				</div>
				<CertificationForm />
				<Button type="button" variant="outline" className="w-full">
					<Plus className="mr-2 h-4 w-4" />
					Add Another Certification
				</Button>
			</div>
		</div>
	);
}
