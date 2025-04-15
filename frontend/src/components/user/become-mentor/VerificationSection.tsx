// src/components/mentor-application/VerificationSection.tsx
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MentorApplicationFormData, FormErrors } from "@/types/mentor.application";

interface VerificationSectionProps {
	formData: MentorApplicationFormData;
	formErrors: FormErrors;
	handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
}

export function VerificationSection({ formData, formErrors, handleInputChange }: VerificationSectionProps) {
	return (
		<div className="space-y-2">
			<Label className="text-base sm:text-lg">Verification</Label>
			<div className="space-y-4">
				<div className="flex items-center space-x-2">
					<Checkbox id="terms" checked={formData.terms} onCheckedChange={(checked) => handleInputChange("terms", !!checked)} />
					<Label htmlFor="terms" className="text-sm sm:text-base font-normal">
						I confirm that all information provided is accurate and complete
					</Label>
				</div>
				{formErrors.terms && <p className="text-red-500 text-xs">{formErrors.terms}</p>}
				<div className="flex items-center space-x-2">
					<Checkbox id="guidelines" checked={formData.guidelines} onCheckedChange={(checked) => handleInputChange("guidelines", !!checked)} />
					<Label htmlFor="guidelines" className="text-sm sm:text-base font-normal">
						I have read and agree to the Mentor Guidelines and Code of Conduct
					</Label>
				</div>
				{formErrors.guidelines && <p className="text-red-500 text-xs">{formErrors.guidelines}</p>}
				<div className="flex items-center space-x-2">
					<Checkbox id="interview" checked={formData.interview} onCheckedChange={(checked) => handleInputChange("interview", !!checked)} />
					<Label htmlFor="interview" className="text-sm sm:text-base font-normal">
						I understand that I may be contacted for an interview as part of the verification process
					</Label>
				</div>
				{formErrors.interview && <p className="text-red-500 text-xs">{formErrors.interview}</p>}
			</div>
		</div>
	);
}
