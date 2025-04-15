// src/components/mentor-application/ExpertiseForm.tsx
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultipleSelector from "@/components/ui/multiple-selector";
import { MentorApplicationFormData, FormErrors } from "@/types/mentor.application";
import { SKILL_OPTIONS } from "@/constants/skill.option";

interface ExpertiseFormProps {
	formData: MentorApplicationFormData;
	formErrors: FormErrors;
	handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
}

export function ExpertiseForm({ formData, formErrors, handleInputChange }: ExpertiseFormProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="expertise">Primary Area of Expertise</Label>
				<Select value={formData.primaryExpertise} onValueChange={(value) => handleInputChange("primaryExpertise", value)}>
					<SelectTrigger className={formErrors.primaryExpertise ? "border-red-500" : ""}>
						<SelectValue placeholder="Select your primary expertise" />
					</SelectTrigger>
					<SelectContent>
						{SKILL_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{formErrors.primaryExpertise && <p className="text-red-500 text-xs">{formErrors.primaryExpertise}</p>}
			</div>

			<div className="space-y-2">
				<Label>Skills</Label>
				<MultipleSelector
					value={formData.skills.map((skill) => ({ label: skill, value: skill }))}
					onChange={(options) =>
						handleInputChange(
							"skills",
							options.map((opt) => opt.value)
						)
					}
					defaultOptions={SKILL_OPTIONS}
					placeholder="Select or type skills..."
					creatable
					emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching skills found.</p>}
					className={`w-full ${formErrors.skills ? "border-red-500" : ""}`}
				/>
				{formErrors.skills && <p className="text-red-500 text-xs">{formErrors.skills}</p>}
				<p className="text-xs text-muted-foreground">Add specific skills like 'JavaScript', 'React', 'Data Analysis', etc.</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="years-experience">Years of Experience</Label>
				<Select value={formData.yearsExperience} onValueChange={(value) => handleInputChange("yearsExperience", value)}>
					<SelectTrigger className={formErrors.yearsExperience ? "border-red-500" : ""}>
						<SelectValue placeholder="Select years of experience" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1-2">1-2 years</SelectItem>
						<SelectItem value="3-5">3-5 years</SelectItem>
						<SelectItem value="6-10">6-10 years</SelectItem>
						<SelectItem value="10+">10+ years</SelectItem>
					</SelectContent>
				</Select>
				{formErrors.yearsExperience && <p className="text-red-500 text-xs">{formErrors.yearsExperience}</p>}
			</div>
		</div>
	);
}
