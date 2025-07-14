import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IndianRupee } from "lucide-react";
import { MentorApplicationFormData } from "@/interfaces/mentor.application";

interface MentoringPreferencesStepProps {
	formData: MentorApplicationFormData;
	handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
	handleArrayChange: (field: keyof MentorApplicationFormData, value: string, checked: boolean) => void;
}

export function MentoringPreferencesStep({ formData, handleInputChange }: MentoringPreferencesStepProps) {
	return (
		<>
			<div className="space-y-4">
				<div className="space-y-2">
					<Label className="font-bold">Session Format</Label>
					<RadioGroup value={formData.sessionFormat} onValueChange={(value) => handleInputChange("sessionFormat", value)}>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="one-on-one" id="one-on-one" />
							<Label htmlFor="one-on-one" className="font-normal">
								One-on-One Sessions Only
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="group" id="group" disabled />
							<Label htmlFor="group" className="font-normal text-gray-400">
								Group Sessions Only (Coming Soon)
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="both" id="both" disabled />
							<Label htmlFor="both" className="font-normal text-gray-400">
								Both One-on-One and Group Sessions (Coming Soon)
							</Label>
						</div>
					</RadioGroup>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label className="font-bold">Session Pricing</Label>
					<RadioGroup value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value)}>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="free" id="free" />
							<Label htmlFor="free" className="font-normal">
								Free Sessions
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="paid" id="paid" />
							<Label htmlFor="paid" className="font-normal">
								Paid Sessions
							</Label>
						</div>
					</RadioGroup>
				</div>

				{formData.pricing === "paid" && (
					<div className="space-y-2">
						<Label className="font-bold" htmlFor="hourly-rate">
							Hourly Rate (INR)
						</Label>
						<div className="relative">
							<IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
							<Input id="hourly-rate" className="pl-9" value={formData.hourlyRate} onChange={(e) => handleInputChange("hourlyRate", e.target.value)} placeholder="e.g. 150" type="number" />
						</div>
						<p className="text-xs text-gray-500">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
					</div>
				)}
			</div>
		</>
	);
}
