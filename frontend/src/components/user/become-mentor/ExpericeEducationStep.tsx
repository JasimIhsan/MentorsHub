import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BriefcaseBusiness, GraduationCap, BookOpen, Plus, X } from "lucide-react";
import { MentorApplicationFormData } from "@/interfaces/mentor.application";

interface ExperienceEducationStepProps {
	formData: MentorApplicationFormData;
	handleNestedChange: (field: "workExperiences" | "educations" | "certifications", index: number, subField: string, value: any) => void;
	handleAddNested: (field: "workExperiences" | "educations" | "certifications") => void;
	handleRemoveNested: (field: "workExperiences" | "educations" | "certifications", index: number) => void;
}

export function ExperienceEducationStep({ formData, handleNestedChange, handleAddNested, handleRemoveNested }: ExperienceEducationStepProps) {
	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<BriefcaseBusiness className="h-5 w-5 text-primary" />
					<h3 className="font-medium">Work Experience</h3>
				</div>
				{formData.workExperiences.map((exp, index) => (
					<div key={index} className="rounded-lg border p-4 space-y-4 relative">
						<div className="space-y-2">
							<Label htmlFor={`job-title-${index}`}>Job Title</Label>
							<Input id={`job-title-${index}`} value={exp.jobTitle} onChange={(e) => handleNestedChange("workExperiences", index, "jobTitle", e.target.value)} placeholder="e.g. Senior Software Engineer" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor={`company-${index}`}>Company</Label>
							<Input id={`company-${index}`} value={exp.company} onChange={(e) => handleNestedChange("workExperiences", index, "company", e.target.value)} placeholder="e.g. Acme Inc." required />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor={`start-date-${index}`}>Start Date</Label>
								<Input id={`start-date-${index}`} type="month" value={exp.startDate} onChange={(e) => handleNestedChange("workExperiences", index, "startDate", e.target.value)} required />
							</div>
							<div className="space-y-2">
								<Label htmlFor={`end-date-${index}`}>End Date</Label>
								<Input id={`end-date-${index}`} type="month" value={exp.endDate} disabled={exp.currentJob} onChange={(e) => handleNestedChange("workExperiences", index, "endDate", e.target.value)} />
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
								required
							/>
						</div>
						{formData.workExperiences.length > 1 && (
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

			<Separator className="my-4" />

			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<GraduationCap className="h-5 w-5 text-primary" />
					<h3 className="font-medium">Education</h3>
				</div>
				{formData.educations.map((edu, index) => (
					<div key={index} className="rounded-lg border p-4 space-y-4 relative">
						<div className="space-y-2">
							<Label htmlFor={`degree-${index}`}>Degree</Label>
							<Input id={`degree-${index}`} value={edu.degree} onChange={(e) => handleNestedChange("educations", index, "degree", e.target.value)} placeholder="e.g. Bachelor of Science in Computer Science" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor={`institution-${index}`}>Institution</Label>
							<Input id={`institution-${index}`} value={edu.institution} onChange={(e) => handleNestedChange("educations", index, "institution", e.target.value)} placeholder="e.g. Stanford University" required />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor={`edu-start-date-${index}`}>Start Year</Label>
								<Input id={`edu-start-date-${index}`} type="number" value={edu.startYear} onChange={(e) => handleNestedChange("educations", index, "startYear", e.target.value)} placeholder="e.g. 2015" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor={`edu-end-date-${index}`}>End Year</Label>
								<Input id={`edu-end-date-${index}`} type="number" value={edu.endYear} onChange={(e) => handleNestedChange("educations", index, "endYear", e.target.value)} placeholder="e.g. 2019" required />
							</div>
						</div>
						{formData.educations.length > 1 && (
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

			<Separator className="my-4" />

			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<BookOpen className="h-5 w-5 text-primary" />
					<h3 className="font-medium">Certifications</h3>
				</div>
				{formData.certifications.map((cert, index) => (
					<div key={index} className="rounded-lg border p-4 space-y-4 relative">
						<div className="space-y-2">
							<Label htmlFor={`certification-${index}`}>Certification Name</Label>
							<Input id={`certification-${index}`} value={cert.name} onChange={(e) => handleNestedChange("certifications", index, "name", e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" required />
						</div>
						<div className="space-y-2">
							<Label htmlFor={`issuing-org-${index}`}>Issuing Organization</Label>
							<Input id={`issuing-org-${index}`} value={cert.issuingOrg} onChange={(e) => handleNestedChange("certifications", index, "issuingOrg", e.target.value)} placeholder="e.g. Amazon Web Services" required />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor={`issue-date-${index}`}>Issue Date</Label>
								<Input id={`issue-date-${index}`} type="month" value={cert.issueDate} onChange={(e) => handleNestedChange("certifications", index, "issueDate", e.target.value)} required />
							</div>
							<div className="space-y-2">
								<Label htmlFor={`expiry-date-${index}`}>Expiry Date (if applicable)</Label>
								<Input id={`expiry-date-${index}`} type="month" value={cert.expiryDate} onChange={(e) => handleNestedChange("certifications", index, "expiryDate", e.target.value)} />
							</div>
						</div>
						{formData.certifications.length > 1 && (
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
		</>
	);
}
