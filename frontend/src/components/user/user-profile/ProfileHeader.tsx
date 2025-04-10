// ProfileHeader.tsx
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Camera, CheckCircle2 } from "lucide-react";
import { UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";
import { UserInterface } from "@/interfaces/interfaces";

interface ProfileHeaderProps {
	user: UserInterface;
	fullName: string;
	isEditing: boolean;
	hasUnsavedChanges: boolean;
	setIsEditing: (value: boolean) => void;
	handleSave: () => void;
	errors: Record<keyof UpdateProfileFormData, string>;
	handleCancel: () => void; // Add cancel handler
}

export function ProfileHeader({ user, fullName, isEditing, hasUnsavedChanges, setIsEditing, handleSave, errors, handleCancel }: ProfileHeaderProps) {
	const hasErrors = Object.values(errors).some((error) => error !== "");

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-4">
				<div className="relative">
					<Avatar className="h-24 w-24 border-4 border-primary/20">
						<AvatarImage src={user?.avatar ?? ""} alt={fullName} />
						<AvatarFallback>{`${user?.firstName?.slice(0, 1) ?? "U"}${user?.lastName?.slice(0, 1) ?? "N"}`}</AvatarFallback>
					</Avatar>
					{isEditing && (
						<Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
							<Camera className="h-4 w-4" />
							<span className="sr-only">Change profile picture</span>
						</Button>
					)}
				</div>
				<div>
					<div className="flex items-center gap-2">
						<h1 className="text-3xl font-bold tracking-tight">{fullName || "Welcome, New User!"}</h1>
						{user?.isVerified && <CheckCircle2 className="h-6 w-6 text-blue-500" />}
					</div>
					<p className="text-muted-foreground flex items-center gap-1">
						{user?.role && `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`}
						{user?.badges?.length ? (
							` • ${user.badges.join(", ")}`
						) : (
							<>
								<span className="h-4 w-4" />
								No badges yet
								{isEditing && <span className="text-sm ml-2 text-primary">— Add some info below!</span>}
							</>
						)}
					</p>
				</div>
			</div>
			<div className="flex gap-2">
				{isEditing && (
					<Button onClick={handleSave} disabled={!hasUnsavedChanges || hasErrors}>
						Save Profile
					</Button>
				)}
				{isEditing && (
					<Button onClick={handleCancel} variant="secondary">
						<Edit className="mr-2 h-4 w-4" />
						Cancel
					</Button>
				)}
				{!isEditing && (
					<Button onClick={() => setIsEditing(!isEditing)}>
						<Edit className="mr-2 h-4 w-4" />
						Edit Profile
					</Button>
				)}
			</div>
		</div>
	);
}
