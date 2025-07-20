import { logoutSession } from "@/api/user/authentication.api.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserInterface } from "@/interfaces/interfaces";
import { logout } from "@/store/slices/userSlice";
import { LogOut, Settings, User, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Alert } from "@/components/custom/alert";
import { NotificationDropdown } from "@/components/custom/NotificationDropdown";
import { useDispatch } from "react-redux";
import { useSocket } from "@/context/SocketContext";
// import { socketService } from "@/services/socket.service";

interface UserProfileNavLinksProps {
	user: UserInterface;
}

export function UserProfileNavLinks({ user }: UserProfileNavLinksProps) {
	const dispatch = useDispatch();
	const { disconnectSocket, isConnected } = useSocket();

	const handleLogout = async () => {
		try {
			if (isConnected) {
				disconnectSocket();
			}
			const response = await logoutSession();
			if (response.success) {
				localStorage.removeItem("persist:root");
				dispatch(logout());
				toast.success(response.message);
			}
		} catch (error) {
			toast.error("Failed to log out");
			console.error("Error logging out:", error);
		}
	};

	// const handleViewAllNotification = () => {
	// 	if (notifications.length > 0) {
	// 		navigate("/notifications");
	// 	}
	// };

	return (
		<div className="flex items-center gap-4 pr-10 md:pr-20 xl:pr-25 justify-center">
			{/* <NotificationDropdown notifications={notifications} onMarkAsRead={handleMarkNotificationRead} onClearAll={handleMarkAllRead} unReadCount={unreadCount}/> */}
			<NotificationDropdown />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.avatar as string} alt="User" />
							<AvatarFallback>{user.firstName ? user.firstName.charAt(0) : "AB"}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.firstName + " " + user.lastName}</p>
							<p className="text-xs leading-none text-muted-foreground">{user.email}</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link to="/profile" className="cursor-pointer">
								<User className="mr-2 h-4 w-4 hover:text-primary-foreground" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/wallet" className="cursor-pointer">
								<Wallet className="mr-2 h-4 w-4 hover:text-primary-foreground" />
								<span>Wallet</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/settings" className="cursor-pointer">
								<Settings className="mr-2 h-4 w-4 hover:text-primary-foreground" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<Alert
						triggerElement={
							<div className="w-full">
								<DropdownMenuItem className="hover:bg-red-600 w-full" onSelect={(e) => e.preventDefault()}>
									<LogOut className="mr-2 h-4 w-4 hover:text-primary-foreground" />
									<span className="hover:text-primary-foreground">Log out</span>
								</DropdownMenuItem>
							</div>
						}
						contentTitle="Confirm Logout"
						contentDescription="Are you sure you want to log out? This will end your session."
						actionText="Log Out"
						onConfirm={handleLogout}
					/>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
