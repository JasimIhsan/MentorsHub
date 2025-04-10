import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Camera, CheckCircle2 } from "lucide-react";
import { UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";
import { UserInterface } from "@/interfaces/interfaces";
import { useState, ChangeEvent, useCallback } from "react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

interface ProfileHeaderProps {
	user: UserInterface;
	fullName: string;
	isEditing: boolean;
	hasUnsavedChanges: boolean;
	setIsEditing: (value: boolean) => void;
	handleSave: () => Promise<void>;
	errors: Record<keyof UpdateProfileFormData, string>;
	handleCancel: () => void;
	onAvatarChange?: (newAvatar: string) => void;
}

export function ProfileHeader({ user, fullName, isEditing, hasUnsavedChanges, setIsEditing, handleSave, errors, handleCancel, onAvatarChange }: ProfileHeaderProps) {
	const hasErrors = Object.values(errors).some((error) => error !== "");

	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [, setCroppedAreaPixels] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [showPreview, setShowPreview] = useState(false); // New state for preview modal

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setSelectedImage(reader.result as string);
				setPreviewImage(null);
			};
			reader.readAsDataURL(file);
		}
	};

	const getCroppedImg = useCallback(async (imageSrc: string, pixelCrop: { x: number; y: number; width: number; height: number }) => {
		const image = new Image();
		image.src = imageSrc;
		await new Promise((resolve) => (image.onload = resolve));

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;

		canvas.width = pixelCrop.width;
		canvas.height = pixelCrop.height;

		ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

		return canvas.toDataURL("image/jpeg");
	}, []);

	const onCropComplete = useCallback(
		async (_croppedArea: any, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
			setCroppedAreaPixels(croppedAreaPixels);
			if (selectedImage) {
				const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
				setPreviewImage(croppedImage);
			}
		},
		[selectedImage, getCroppedImg]
	);

	const handleCropSave = () => {
		if (previewImage) {
			onAvatarChange?.(previewImage);
			setSelectedImage(null);
		}
	};

	const handleCropCancel = () => {
		setSelectedImage(null);
		setPreviewImage(null);
	};

	const handleProfileCancel = () => {
		setPreviewImage(null);
		handleCancel();
	};

	const handleSaveWithLoading = async () => {
		setIsSaving(true);
		try {
			await handleSave();
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-center gap-4">
				<div className="relative">
					<Avatar className="h-24 w-24 border-4 border-primary/20 cursor-pointer" onClick={() => setShowPreview(true)}>
						<AvatarImage src={previewImage || user?.avatar || ""} alt={fullName} />
						<AvatarFallback>{`${user?.firstName?.slice(0, 1) ?? "U"}${user?.lastName?.slice(0, 1) ?? "N"}`}</AvatarFallback>
					</Avatar>
					{isEditing && (
						<div className="absolute -bottom-2 -right-2">
							<input type="file" accept="image/*" className="hidden" id="avatar-upload" onChange={handleImageChange} disabled={isSaving} />
							<Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => document.getElementById("avatar-upload")?.click()} disabled={isSaving}>
								<Camera className="h-4 w-4" />
								<span className="sr-only">Change profile picture</span>
							</Button>
						</div>
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
					<Button onClick={handleSaveWithLoading} disabled={!hasUnsavedChanges || hasErrors || isSaving}>
						{isSaving ? (
							<>
								<svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
								</svg>
								Saving...
							</>
						) : (
							"Save Profile"
						)}
					</Button>
				)}
				{isEditing && (
					<Button onClick={handleProfileCancel} variant="secondary" disabled={isSaving}>
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

			{selectedImage && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-white p-4 rounded-lg max-w-lg w-full">
						<div className="relative h-80">
							<Cropper image={selectedImage} crop={crop} zoom={zoom} aspect={1} cropShape="round" showGrid={false} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
						</div>
						<div className="flex gap-2 mt-4">
							<Button onClick={handleCropSave}>Save Crop</Button>
							<Button variant="secondary" onClick={handleCropCancel}>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}

			{showPreview && (
				<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
					<div className="relative max-w-2xl w-full">
						<img src={previewImage || user?.avatar || ""} alt="Profile preview" className="w-full h-auto rounded-lg" />
						<Button variant="outline" className="absolute top-2 right-2" onClick={() => setShowPreview(false)}>
							X
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
