import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { getFullName, updateUser } from "@/store/slices/userSlice";
import { UserInterface } from "@/interfaces/interfaces";
import { updateUserApi } from "@/api/user/user.profile.api.service";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/user/user-profile/ProfileHeader";
import { BioSection } from "@/components/user/user-profile/BioSection";
import { SkillsInterestsSection } from "@/components/user/user-profile/SkillsInterestSection";
import { SessionHistorySection } from "@/components/user/user-profile/SessionHistory";
import { PersonalInfoSection } from "@/components/user/user-profile/PersonalInformation";
import { AccountSettingsSection } from "@/components/user/user-profile/AccountSettings";
import { updateProfileSchema, UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";
import { z } from "zod";

export default function UserProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const user = useSelector((state: RootState) => state.auth.user as UserInterface);
	const fullName = useSelector(getFullName);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState<UpdateProfileFormData & { avatar?: string }>({
		firstName: "",
		lastName: "",
		email: "",
		skills: [],
		interests: [],
		bio: "",
		avatar: "", // Add avatar field
	});

	const [originalFormData, setOriginalFormData] = useState<(UpdateProfileFormData & { avatar?: string }) | null>(null);
	const [errors, setErrors] = useState<Record<keyof UpdateProfileFormData, string>>({
		firstName: "",
		lastName: "",
		email: "",
		skills: "",
		interests: "",
		bio: "",
	});

	useEffect(() => {
		if (user) {
			const initialData = {
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				email: user.email || "",
				skills: user.skills || [],
				interests: user.interests || [],
				bio: user.bio || "",
				avatar: user.avatar || "",
			};
			setFormData(initialData);
			if (!originalFormData) {
				setOriginalFormData(initialData);
			}
		}
	}, [user, originalFormData]);

	const handleInputChange = (field: keyof UpdateProfileFormData, value: any) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
		setHasUnsavedChanges(true);
		if (isEditing) {
			validateField(field, value);
		}
	};

	const handleAvatarChange = (newAvatar: string) => {
		setFormData((prev) => ({
			...prev,
			avatar: newAvatar,
		}));
		setHasUnsavedChanges(true);
	};

	const validateField = (field: keyof UpdateProfileFormData, value: any) => {
		try {
			updateProfileSchema.parse({ ...formData, [field]: value });
			setErrors((prev) => ({ ...prev, [field]: "" }));
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldError = error.errors.find((e) => e.path[0] === field);
				setErrors((prev) => ({ ...prev, [field]: fieldError?.message || "Invalid input" }));
			}
		}
	};

	const validateForm = (): boolean => {
		try {
			updateProfileSchema.parse(formData);
			setErrors({
				firstName: "",
				lastName: "",
				email: "",
				skills: "",
				interests: "",
				bio: "",
			});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formattedErrors = error.errors.reduce((acc, curr) => {
					acc[curr.path[0] as keyof UpdateProfileFormData] = curr.message;
					return acc;
				}, {} as Record<keyof UpdateProfileFormData, string>);
				setErrors(formattedErrors);
				toast.error("Please fix the errors in the form before saving.");
				return false;
			}
			return false;
		}
	};

	const handleSave = async () => {
		if (!validateForm()) {
			return;
		}

		try {
			const response = await updateUserApi(user.id as string, formData);
			if (response.success) {
				dispatch(updateUser(response.user));
				setHasUnsavedChanges(false);
				setIsEditing(false);
				toast.success("Profile updated successfully!");
				setOriginalFormData(formData);
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const handleCancel = () => {
		if (originalFormData) {
			setFormData(originalFormData);
			setErrors({
				firstName: "",
				lastName: "",
				email: "",
				skills: "",
				interests: "",
				bio: "",
			});
			setHasUnsavedChanges(false);
		}
		setIsEditing(false);
	};

	const handleNavigation = (path: string) => {
		if (hasUnsavedChanges) {
			const confirmed = window.confirm("You have unsaved changes. Are you sure you want to leave without saving?");
			if (confirmed) {
				navigate(path);
			}
		} else {
			navigate(path);
		}
	};

	if (!user) {
		return (
			<div className="container py-8 px-10 md:px-20 xl:px-25 flex justify-center items-center h-screen">
				<p className="text-xl font-semibold text-muted-foreground animate-pulse">Loading your profile...</p>
			</div>
		);
	}

	return (
		<div className="container py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-8">
					<ProfileHeader
						user={user}
						fullName={fullName}
						isEditing={isEditing}
						hasUnsavedChanges={hasUnsavedChanges}
						setIsEditing={setIsEditing}
						handleSave={handleSave}
						errors={errors}
						handleCancel={handleCancel}
						onAvatarChange={handleAvatarChange} // Pass avatar change handler
					/>
					{user.mentorRequestStatus === "rejected" && (
						<div className="bg-red-100 text-red-700 p-4 rounded-md">
							<p className="font-semibold">Your request to become a mentor has been rejected.</p>
							<p>Please check your email for further details and the reason for the rejection.</p>
						</div>
					)}
					{/* <div className="bg-red-100 text-red-700 p-4 rounded-md">
						<p className="font-semibold">Your request to become a mentor has been rejected.</p>
						<p>Please check your email for further details and the reason for the rejection.</p>
					</div> */}
				</div>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div className="space-y-6 lg:col-span-2">
						<BioSection bio={formData.bio} isEditing={isEditing} handleInputChange={handleInputChange} errors={errors} />
						<SkillsInterestsSection formData={formData} isEditing={isEditing} handleInputChange={handleInputChange} errors={errors} />
						<SessionHistorySection user={user} pastSessions={[]} upcomingSessions={[]} />
					</div>
					<div className="space-y-6">
						<PersonalInfoSection formData={formData} isEditing={isEditing} handleInputChange={handleInputChange} errors={errors} />
						<AccountSettingsSection handleNavigation={handleNavigation} />
					</div>
				</div>
			</div>
		</div>
	);
}
