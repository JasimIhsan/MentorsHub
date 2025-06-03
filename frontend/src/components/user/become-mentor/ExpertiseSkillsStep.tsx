import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MultipleSelector from "@/components/ui/multiple-selector";
import { SKILL_OPTIONS } from "@/constants/skill.option";
import { MentorApplicationFormData } from "@/types/mentor.application";

interface ExpertiseSkillsStepProps {
	formData: MentorApplicationFormData;
	handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
}

export function ExpertiseSkillsStep({ formData, handleInputChange }: ExpertiseSkillsStepProps) {
	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="expertise">Primary Area of Expertise</Label>
				<Select value={formData.primaryExpertise} onValueChange={(value) => handleInputChange("primaryExpertise", value)}>
					<SelectTrigger>
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
			</div>

			<div className="space-y-2">
				<Label>Skills</Label>
				<MultipleSelector
					value={formData.skills.map((skill: string) => ({ label: skill, value: skill }))}
					onChange={(options) =>
						handleInputChange(
							"skills",
							options.map((opt) => opt.value)
						)
					}
					defaultOptions={SKILL_OPTIONS}
					placeholder="Select or type skills..."
					creatable
					emptyIndicator={<p className="text-center text-sm text-gray-500">No matching skills found.</p>}
					className="w-full"
				/>
				<p className="text-xs text-gray-500">Add specific skills like 'JavaScript', 'React', 'Data Analysis', etc.</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="years-experience">Years of Experience</Label>
				<Select value={formData.yearsExperience} onValueChange={(value) => handleInputChange("yearsExperience", value)}>
					<SelectTrigger>
						<SelectValue placeholder="Select years of experience" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1-2">1-2 years</SelectItem>
						<SelectItem value="3-5">3-5 years</SelectItem>
						<SelectItem value="6-10">6-10 years</SelectItem>
						<SelectItem value="10+">10+ years</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</>
	);
}
