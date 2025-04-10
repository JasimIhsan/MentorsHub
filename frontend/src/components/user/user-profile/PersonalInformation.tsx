import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";
import { useEffect } from "react";

interface PersonalInfoSectionProps {
	formData: UpdateProfileFormData;
	isEditing: boolean;
	handleInputChange: (field: keyof UpdateProfileFormData, value: any) => void;
	errors: Record<keyof UpdateProfileFormData, string>;
}

export function PersonalInfoSection({ formData, isEditing, handleInputChange, errors }: PersonalInfoSectionProps) {
	useEffect(() => {
		// You can add logic here if needed, e.g., focus on first input when editing starts
	}, [isEditing]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">First Name</Label>
						<Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} disabled={!isEditing} placeholder="Enter your first name" className={errors.firstName ? "border-red-500" : ""} />
						{isEditing && errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="lastName">Last Name</Label>
						<Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} disabled={!isEditing} placeholder="Enter your last name" className={errors.lastName ? "border-red-500" : ""} />
						{isEditing && errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							disabled={true} // Changed to match other fields
							placeholder="Enter your email"
							className={errors.email ? "border-red-500" : ""}
						/>
						{isEditing && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
