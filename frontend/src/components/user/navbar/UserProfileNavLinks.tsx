import { logoutSession } from "@/api/user/authentication.api.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserInterface } from "@/interfaces/interfaces";
import { logout } from "@/store/slices/userSlice";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Alert } from "@/components/custom/alert";
import { useNotifications } from "@/hooks/useNotification";

interface UserProfileNavLinksProps {
	user: UserInterface;
}

export function UserProfileNavLinks({ user }: UserProfileNavLinksProps) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { notifications, unreadCount, handleMarkAllRead, handleMarkNotificationRead } = useNotifications(user.id as string);

	const handleLogout = async () => {
		try {
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

	const handleViewAllNotification = () => {
		if (notifications.length > 0) {
			navigate("/notifications");
		}
	};

	return (
		<div className="flex items-center gap-4 pr-10 md:pr-20 xl:pr-25 justify-center">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full transition-colors">
						<Bell className="h-5 w-5 text-gray-600" />
						{unreadCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{unreadCount}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-120 p-2 bg-white shadow-lg rounded-lg border border-gray-200" align="end">
					<div className="flex justify-between items-center px-2 py-1.5 text-sm font-semibold text-gray-800">
						<span>Notifications</span>
						{unreadCount > 0 && (
							<Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs text-blue-600 hover:text-blue-800">
								Clear All
							</Button>
						)}
					</div>
					<hr className="my-1" />
					<div className="max-h-100 overflow-y-auto">
						{notifications.length === 0 ? (
							<div className="text-center text-sm text-gray-500 py-4">No new notifications</div>
						) : (
							notifications.map((notification) => (
								<div
									key={notification.id}
									className={`flex flex-col p-2 mb-1 rounded-md hover:bg-gray-50 transition-colors cursor-pointer ${notification.isRead ? "bg-gray-50" : "bg-white"}`}
									onClick={() => handleMarkNotificationRead(notification.id)}>
									<div className="flex justify-between items-center w-full">
										<span className={`text-sm ${notification.isRead ? "text-gray-600" : "font-medium text-gray-900"}`}>{notification.title}</span>
										<span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleDateString()}</span>
									</div>
									<p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
									{notification.link && (
										<Link to={notification.link} className="text-xs text-blue-600 hover:underline mt-1" onClick={(e) => e.stopPropagation()}>
											View
										</Link>
									)}
								</div>
							))
						)}
					</div>
					<hr className="my-1" />
					<Button variant="ghost" size="sm" className="w-full" onClick={handleViewAllNotification}>
						View All Notifications
					</Button>
				</PopoverContent>
			</Popover>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.avatar as string} alt="User" />
							<AvatarFallback>{user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}</AvatarFallback>
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
