import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { changePasswordApi } from "@/api/user/user.profile.api.service";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface AccountSettingsSectionProps {
	handleNavigation: (path: string) => void;
}

// Define Zod schema for password validation
const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, "Current password is required"),
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		// .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		// .regex(/[a-z]/, "Password must contain at least one lowercase letter")
		// .regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type PasswordFormData = z.infer<typeof passwordSchema>;

export function AccountSettingsSection({ handleNavigation }: AccountSettingsSectionProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const user = useSelector((state: any) => state.userAuth.user);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PasswordFormData>({
		resolver: zodResolver(passwordSchema),
	});

	const onSubmit = async (data: PasswordFormData) => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await changePasswordApi(user.id as string, data.currentPassword, data.newPassword);
			if (response.success) {
				toast.success("Password changed successfully!");
				reset();
			}
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Account Settings</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="w-full justify-start">
								Change Password
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Change Password</DialogTitle>
								<DialogDescription>Update your account password here.</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
								<div className="space-y-2">
									<label htmlFor="current-password" className="text-sm font-medium">
										Current Password
									</label>
									<input id="current-password" type="password" className={`w-full p-2 border rounded-md ${errors.currentPassword ? "border-red-500" : ""}`} placeholder="Enter current password" {...register("currentPassword")} />
									{errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword.message}</p>}
								</div>

								<div className="space-y-2">
									<label htmlFor="new-password" className="text-sm font-medium">
										New Password
									</label>
									<input id="new-password" type="password" className={`w-full p-2 border rounded-md ${errors.newPassword ? "border-red-500" : ""}`} placeholder="Enter new password" {...register("newPassword")} />
									{errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword.message}</p>}
								</div>

								<div className="space-y-2">
									<label htmlFor="confirm-password" className="text-sm font-medium">
										Confirm New Password
									</label>
									<input id="confirm-password" type="password" className={`w-full p-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : ""}`} placeholder="Confirm new password" {...register("confirmPassword")} />
									{errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
								</div>

								{error && <p className="text-sm text-red-500">{error}</p>}

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Updating..." : "Update Password"}
								</Button>
							</form>
						</DialogContent>
					</Dialog>

					{/* Notification Settings Dialog remains unchanged */}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="w-full justify-start">
								Notification Settings
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Notification Settings</DialogTitle>
								<DialogDescription>Manage your notification preferences.</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<p className="text-sm text-muted-foreground">Click below to adjust your notification settings.</p>
								<Button className="w-full" onClick={() => handleNavigation("/settings/notifications")}>
									Go to Notification Settings
								</Button>
							</div>
						</DialogContent>
					</Dialog>

					{/* Privacy Settings Dialog remains unchanged */}
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="w-full justify-start">
								Privacy Settings
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Privacy Settings</DialogTitle>
								<DialogDescription>Configure your privacy options.</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<p className="text-sm text-muted-foreground">Click below to update your privacy settings.</p>
								<Button className="w-full" onClick={() => handleNavigation("/settings/privacy")}>
									Go to Privacy Settings
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</CardContent>
		</Card>
	);
}
