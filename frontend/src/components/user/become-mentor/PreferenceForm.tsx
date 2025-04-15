// src/components/mentor-application/PreferencesForm.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IndianRupee } from "lucide-react";
import { MentorApplicationFormData, FormErrors } from "@/types/mentor.application";
import { AVAILABILITY_OPTIONS } from "@/constants/mentor.application";

interface PreferencesFormProps {
	formData: MentorApplicationFormData;
	formErrors: FormErrors;
	handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
	handleArrayChange: (field: keyof MentorApplicationFormData, value: string, checked: boolean) => void;
}

export function PreferencesForm({ formData, formErrors, handleInputChange, handleArrayChange }: PreferencesFormProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label className="font-bold text-base sm:text-lg">Session Format</Label>
					<RadioGroup value={formData.sessionFormat} onValueChange={(value) => handleInputChange("sessionFormat", value)} className="space-y-2">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="one-on-one" id="one-on-one" />
							<Label htmlFor="one-on-one" className="font-normal text-sm sm:text-base">
								One-on-One Sessions Only
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="group" id="group" />
							<Label htmlFor="group" className="font-normal text-sm sm:text-base">
								Group Sessions Only
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="both" id="both" />
							<Label htmlFor="both" className="font-normal text-sm sm:text-base">
								Both One-on-One and Group Sessions
							</Label>
						</div>
					</RadioGroup>
					{formErrors.sessionFormat && <p className="text-red-500 text-xs">{formErrors.sessionFormat}</p>}
				</div>

				<div className="space-y-2">
					<Label className="font-bold text-base sm:text-lg">Session Type</Label>
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Checkbox id="video-calls" checked={formData.sessionTypes.includes("video-calls")} onCheckedChange={(checked) => handleArrayChange("sessionTypes", "video-calls", !!checked)} />
							<Label htmlFor="video-calls" className="font-normal text-sm sm:text-base">
								Video Calls
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<Checkbox id="chat" checked={formData.sessionTypes.includes("chat")} onCheckedChange={(checked) => handleArrayChange("sessionTypes", "chat", !!checked)} />
							<Label htmlFor="chat" className="font-normal text-sm sm:text-base">
								Text Chat
							</Label>
						</div>
					</div>
					{formErrors.sessionTypes && <p className="text-red-500 text-xs">{formErrors.sessionTypes}</p>}
				</div>

				<Separator />

				<div className="space-y-2">
					<Label className="font-bold text-base sm:text-lg">Session Pricing</Label>
					<RadioGroup value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value)} className="space-y-2">
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="free" id="free" />
							<Label htmlFor="free" className="font-normal text-sm sm:text-base">
								Free Sessions
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="paid" id="paid" />
							<Label htmlFor="paid" className="font-normal text-sm sm:text-base">
								Paid Sessions
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="both-pricing" id="both-pricing" />
							<Label htmlFor="both-pricing" className="font-normal text-sm sm:text-base">
								Both Free and Paid Sessions
							</Label>
						</div>
					</RadioGroup>
					{formErrors.pricing && <p className="text-red-500 text-xs">{formErrors.pricing}</p>}
				</div>

				<div className="space-y-2">
					<Label className="font-bold text-base sm:text-lg" htmlFor="hourly-rate">
						Hourly Rate (INR)
					</Label>
					<div className="relative">
						<IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							id="hourly-rate"
							className={`pl-9 ${formErrors.hourlyRate ? "border-red-500" : ""}`}
							value={formData.hourlyRate}
							onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
							placeholder="e.g. 150"
							type="number"
							min="0"
						/>
					</div>
					{formErrors.hourlyRate && <p className="text-red-500 text-xs">{formErrors.hourlyRate}</p>}
					<p className="text-xs text-muted-foreground">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
				</div>

				<Separator />

				<div className="space-y-2">
					<Label className="font-bold text-base sm:text-lg">Availability</Label>
					<div className="grid grid-cols-2 gap-2 sm:gap-4">
						{AVAILABILITY_OPTIONS.map((option) => (
							<div key={option} className="flex items-center space-x-2">
								<Checkbox id={option} checked={formData.availability.includes(option)} onCheckedChange={(checked) => handleArrayChange("availability", option, !!checked)} />
								<Label htmlFor={option} className="text-sm sm:text-base font-normal">
									{option.charAt(0).toUpperCase() + option.slice(1)}
								</Label>
							</div>
						))}
					</div>
					{formErrors.availability && <p className="text-red-500 text-xs">{formErrors.availability}</p>}
				</div>
			</div>
		</div>
	);
}
