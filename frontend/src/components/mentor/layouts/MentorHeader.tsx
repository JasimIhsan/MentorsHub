import { ArrowRightLeft, Calendar, LogOut, Settings, User, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/assets/logo.png.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSession } from "@/api/user/authentication.api.service";
import { logout } from "@/store/slices/userSlice";
import { toast } from "sonner";
import { RootState } from "@/store/store";
import { Alert } from "@/components/custom/alert";
import { NotificationDropdown } from "@/components/custom/NotificationDropdown";

export function MentorHeader() {
	const user = useSelector((state: RootState) => state.userAuth.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

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

	if (!user) {
		return (
			<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="flex h-16 items-center px-4 md:px-6">
					<div className="flex items-center gap-2 cursor-pointer">
						<div className="w-8">
							<img src={Logo} alt="" className="w-full" />
						</div>
						<span className="hidden font-bold sm:inline-block">MentorsHub</span>
					</div>
					<div className="ml-auto">
						<Button variant="secondary" asChild>
							<Link to="/login">Log In</Link>
						</Button>
					</div>
				</div>
			</header>
		);
	}

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center px-4 md:px-6">
				<div className="flex items-center gap-2 cursor-pointer">
					<div className="w-8">
						<img src={Logo} alt="" className="w-full" />
					</div>
					<span className="hidden font-bold sm:inline-block">MentorsHub</span>
				</div>

				<div className="ml-auto flex items-center gap-4">
					<Button variant="secondary" size="default" onClick={() => navigate("/dashboard")}>
						<ArrowRightLeft className="h-5 w-5" />
						<span>Switch to User Dashboard</span>
					</Button>

					<Button variant="outline" size="icon">
						<Calendar className="h-5 w-5" />
						<span className="sr-only">Calendar</span>
					</Button>

					<NotificationDropdown />

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
								<Avatar className="h-9 w-9">
									<AvatarImage src={user.avatar ?? ""} alt="User" />
									<AvatarFallback>{user.firstName?.slice(0, 1) ?? "" + user.lastName?.slice(0, 1) ?? ""}</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-[1000]" align="end" forceMount>
							<DropdownMenuLabel className="font-normal">
								<div className="flex flex-col space-y-1">
									<p className="text-sm font-medium leading-none">
										{user.firstName ?? ""} {user.lastName ?? ""}
									</p>
									<p className="text-xs leading-none text-muted-foreground">{user.email ?? ""}</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link to="/mentor/profile" className="cursor-pointer flex items-center">
									<User className="mr-2 h-4 w-4" />
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/wallet" className="cursor-pointer flex items-center">
									<Wallet className="mr-2 h-4 w-4" />
									<span>Wallet</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link to="/settings" className="cursor-pointer flex items-center">
									<Settings className="mr-2 h-4 w-4" />
									<span>Settings</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<Alert
								triggerElement={
									<div className="w-full">
										<DropdownMenuItem className="hover:bg-red-600 w-full" onSelect={(e) => e.preventDefault()}>
											<LogOut className="mr-2 h-4 w-4" />
											<span>Log out</span>
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
			</div>
		</header>
	);
}
