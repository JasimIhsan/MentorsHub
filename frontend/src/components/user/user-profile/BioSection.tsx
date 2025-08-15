// BioSection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";
import { UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";

interface BioSectionProps {
	bio: string | undefined;
	isEditing: boolean;
	handleInputChange: (field: keyof UpdateProfileFormData, value: any) => void;
	errors: Record<keyof UpdateProfileFormData, string>;
}

export function BioSection({ bio, isEditing, handleInputChange, errors }: BioSectionProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Bio</CardTitle>
				{!isEditing && <CardDescription>A short professional summary</CardDescription>}
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<Textarea value={bio || ""} onChange={(e) => handleInputChange("bio", e.target.value)} placeholder="Add a short bio..." className={errors.bio ? "border-red-500" : ""} />
				) : bio ? (
					<p>{bio}</p>
				) : (
					<div className="text-muted-foreground flex items-center gap-2">
						<Info className="h-4 w-4" />
						<p>No bio yet. Edit to add one!</p>
					</div>
				)}
				{errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
			</CardContent>
		</Card>
	);
}
