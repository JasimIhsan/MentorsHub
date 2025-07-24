import { IUserDTO } from "@/interfaces/user.interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserDetailsModalProps {
	user: IUserDTO;
	onClose: () => void;
}

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
	// Generate initials for AvatarFallback from fullName
	const getInitials = (fullName: string) => {
		if (!fullName) return "N/A";
		const names = fullName.trim().split(" ");
		return names
			.map((name) => name.charAt(0))
			.slice(0, 2)
			.join("")
			.toUpperCase();
	};

	// Format dates for display
	const formatDate = (date: Date | string | null | undefined) => {
		if (!date) return "N/A";
		const d = date instanceof Date ? date : new Date(date);
		return d.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg md:max-w-4xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">User Details</DialogTitle>
				</DialogHeader>
				<div className="space-y-8 py-6">
					{/* Header: Avatar and Personal Info */}
					<div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-muted/50 p-6 rounded-lg">
						<Avatar className="h-20 w-20">
							<AvatarImage src={user.avatar ?? undefined} alt={user.fullName || "User"} className="object-cover" />
							<AvatarFallback className="text-xl font-medium bg-primary/10">{getInitials(user.fullName)}</AvatarFallback>
						</Avatar>
						<div className="text-center sm:text-left">
							<h2 className="text-xl font-bold text-foreground">{user.fullName || "N/A"}</h2>
							<div className="mt-2 space-y-1">
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Name: </span>
									{user.firstName} {user.lastName}
								</p>
								<p className="text-sm text-muted-foreground">
									<span className="font-medium">Email: </span>
									{user.email || "N/A"}
								</p>
							</div>
						</div>
					</div>

					{/* Main Content: Grid Layout */}
					<div className="grid gap-8 md:grid-cols-3">
						{/* Account Information */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Account Information</h3>
							<div className="space-y-3">
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Role</Label>
									<p className="text-foreground">{user.role || "N/A"}</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Status</Label>
									<p className="text-foreground capitalize">{user.status || "N/A"}</p>
								</div>
								{/* <div>
									<Label className="text-sm font-medium text-muted-foreground">User ID</Label>
									<p className="text-foreground">{user.id || "N/A"}</p>
								</div> */}
							</div>
						</div>

						{/* Profile Details */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Profile Details</h3>
							<div className="space-y-3">
								{user.bio && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Bio</Label>
										<p className="text-foreground">{user.bio}</p>
									</div>
								)}
								{user.skills && user.skills.length > 0 && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Skills</Label>
										<p className="text-foreground">{user.skills.join(", ") || "N/A"}</p>
									</div>
								)}
								{user.interests && user.interests.length > 0 && (
									<div>
										<Label className="text-sm font-medium text-muted-foreground">Interests</Label>
										<p className="text-foreground">{user.interests.join(", ") || "N/A"}</p>
									</div>
								)}
							</div>
						</div>

						{/* Account Metadata */}
						<div className="space-y-4">
							<h3 className="text-lg font-medium text-foreground border-b pb-2">Account Metadata</h3>
							<div className="space-y-3">
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Created At</Label>
									<p className="text-foreground">{formatDate(user.createdAt)}</p>
								</div>
								<div>
									<Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
									<p className="text-foreground">{formatDate(user.updatedAt)}</p>
								</div>
							</div>
						</div>

						{/* Badges */}
						{user.badges && user.badges.length > 0 && (
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-foreground border-b pb-2">Badges</h3>
								<div className="flex flex-wrap gap-2">
									{user.badges.map((badge, index) => (
										<Badge key={index} variant="secondary" className="text-sm">
											{badge}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Mentor Information */}
						{/* {(user.role === "mentor" || user.mentorDetailsId || user.sessionCompleted) && (
							<div className="space-y-4">
								<h3 className="text-lg font-medium text-foreground border-b pb-2">Mentor Information</h3>
								<div className="space-y-3">
									{user.sessionCompleted !== undefined && (
										<div>
											<Label className="text-sm font-medium text-muted-foreground">Sessions Completed</Label>
											<p className="text-foreground">{user.sessionCompleted ?? "N/A"}</p>
										</div>
									)}
									{user.mentorDetailsId && (
										<div>
											<Label className="text-sm font-medium text-muted-foreground">Mentor Details ID</Label>
											<p className="text-foreground">{user.mentorDetailsId}</p>
										</div>
									)}
								</div>
							</div>
						)} */}

						
					</div>
				</div>
				<DialogFooter className="mt-6">
					<DialogClose asChild>
						<Button variant="default" onClick={onClose}>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
