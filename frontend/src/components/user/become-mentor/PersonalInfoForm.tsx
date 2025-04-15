// src/components/mentor-application/PersonalInfoForm.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MentorApplicationFormData, FormErrors } from "@/types/mentor.application";
import { LANGUAGES } from "@/constants/mentor.application";

interface PersonalInfoFormProps {
	formData: MentorApplicationFormData;
	formErrors: FormErrors;
	handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
	handleArrayChange: (field: keyof MentorApplicationFormData, value: string, checked: boolean) => void;
}

export function PersonalInfoForm({ formData, formErrors, handleInputChange, handleArrayChange }: PersonalInfoFormProps) {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="first-name">First Name</Label>
					<Input id="first-name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className={formErrors.firstName ? "border-red-500" : ""} />
					{formErrors.firstName && <p className="text-red-500 text-xs">{formErrors.firstName}</p>}
				</div>
				<div className="space-y-2">
					<Label htmlFor="last-name">Last Name</Label>
					<Input id="last-name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className={formErrors.lastName ? "border-red-500" : ""} />
					{formErrors.lastName && <p className="text-red-500 text-xs">{formErrors.lastName}</p>}
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="professional-title">Professional Title</Label>
				<Input
					id="professional-title"
					value={formData.professionalTitle}
					onChange={(e) => handleInputChange("professionalTitle", e.target.value)}
					placeholder="e.g. Senior Software Engineer"
					className={formErrors.professionalTitle ? "border-red-500" : ""}
				/>
				{formErrors.professionalTitle && <p className="text-red-500 text-xs">{formErrors.professionalTitle}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="bio">Professional Bio</Label>
				<Textarea
					id="bio"
					value={formData.bio}
					onChange={(e) => handleInputChange("bio", e.target.value)}
					placeholder="Tell us about yourself, your expertise, and why you want to be a mentor..."
					className={`min-h-[120px] sm:min-h-[150px] ${formErrors.bio ? "border-red-500" : ""}`}
				/>
				{formErrors.bio && <p className="text-red-500 text-xs">{formErrors.bio}</p>}
				<p className="text-xs text-muted-foreground">This will be displayed on your mentor profile.</p>
			</div>

			<div className="space-y-2">
				<Label>Languages Spoken</Label>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
					{LANGUAGES.map((lang) => (
						<div key={lang} className="flex items-center space-x-2">
							<Checkbox id={`lang-${lang}`} checked={formData.languages.includes(lang)} onCheckedChange={(checked) => handleArrayChange("languages", lang, !!checked)} />
							<Label htmlFor={`lang-${lang}`} className="text-sm font-normal">
								{lang}
							</Label>
						</div>
					))}
				</div>
				{formErrors.languages && <p className="text-red-500 text-xs mt-2">{formErrors.languages}</p>}
				<p className="text-xs text-muted-foreground mt-2">Select all languages you speak fluently.</p>
			</div>
		</div>
	);
}
