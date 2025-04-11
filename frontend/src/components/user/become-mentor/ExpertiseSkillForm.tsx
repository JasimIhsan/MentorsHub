import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SKILL_OPTIONS } from "@/data/skill.option";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

export default function ExpertiseSkillsForm() {
	const form = useFormContext();

	const handleSkillsChange = (options: Option[]) => {
		const uniqueSkills = Array.from(new Set(options.map((opt) => opt.label)));
		form.setValue("skills", uniqueSkills); // Update react-hook-form field
	};


	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="primaryExpertise"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Primary Area of Expertise</FormLabel>
						<FormControl>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="skills"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Skills</FormLabel>
						<div className="flex flex-wrap gap-2 mb-2">
							{/* {field.value.map((skill: string) => (
								<Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
									{skill}
									<button onClick={() => handleRemoveSkill(skill)} className="ml-1 rounded-full hover:bg-muted">
										<X className="h-3 w-3" />
										<span className="sr-only">Remove {skill}</span>
									</button>
								</Badge>
							))} */}
							{field.value.length === 0 && <p className="text-sm text-muted-foreground">Add skills that you can mentor others in.</p>}
						</div>
						<MultipleSelector
							value={field.value.map((skill: string) => ({ label: skill, value: skill.toLowerCase() }))}
							onChange={handleSkillsChange}
							defaultOptions={SKILL_OPTIONS}
							placeholder="Select or type skills..."
							creatable
							emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching skills found.</p>}
							className="w-full"
						/>
						<p className="text-xs text-muted-foreground">Add specific skills like "JavaScript", "React", "Data Analysis", etc.</p>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="yearsExperience"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Years of Experience</FormLabel>
						<FormControl>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
