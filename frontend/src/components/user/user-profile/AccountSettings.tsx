import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { useNavigate } from "react-router-dom";

interface AccountSettingsSectionProps {
	handleNavigation: (path: string) => void;
}

export function AccountSettingsSection({ handleNavigation }: AccountSettingsSectionProps) {
	// const navigate = useNavigate();

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
							<form
								className="space-y-4 py-4"
								onSubmit={(e) => {
									e.preventDefault();
									console.log("Password change submitted");
								}}>
								<div className="space-y-2">
									<label htmlFor="current-password" className="text-sm font-medium">
										Current Password
									</label>
									<input id="current-password" type="password" className="w-full p-2 border rounded-md" placeholder="Enter current password" required />
								</div>
								<div className="space-y-2">
									<label htmlFor="new-password" className="text-sm font-medium">
										New Password
									</label>
									<input id="new-password" type="password" className="w-full p-2 border rounded-md" placeholder="Enter new password" required />
								</div>
								<div className="space-y-2">
									<label htmlFor="confirm-password" className="text-sm font-medium">
										Confirm New Password
									</label>
									<input id="confirm-password" type="password" className="w-full p-2 border rounded-md" placeholder="Confirm new password" required />
								</div>
								<Button type="submit" className="w-full">
									Update Password
								</Button>
							</form>
						</DialogContent>
					</Dialog>

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
