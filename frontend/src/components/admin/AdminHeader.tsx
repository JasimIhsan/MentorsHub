import { Link } from "react-router-dom";
import { Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { ModeToggle } from "@/components/mode-toggle";

export function AdminHeader() {
	const admin = useSelector((state: RootState) => state.adminAuth.admin);
	return (
		<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 justify-end lg:justify-between">
			<Link to="/admin/dashboard" className="hidden lg:flex items-center gap-2 font-semibold">
				<span className="text-primary text-2xl">MentorsHub</span>
				<span className="text-xs font-normal text-muted-foreground">{admin?.isSuperAdmin ? "Super Admin" : "Admin"}</span>
			</Link>

			{/* <div className="relative ml-auto flex-1 max-w-md">
				<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input type="search" placeholder="Search..." className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]" />
			</div> */}

			<div className="flex items-center gap-2">
				{/* <ModeToggle /> */}
				<Button variant="outline" size="icon">
					<HelpCircle className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Help</span>
				</Button>
				<Button variant="outline" size="icon">
					<Bell className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">Notifications</span>
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-8 w-8 rounded-full">
							<Avatar className="h-8 w-8">
								<AvatarImage src="/placeholder.svg" alt="Admin" />
								<AvatarFallback>AD</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56" align="end" forceMount>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">Super Admin</p>
								<p className="text-xs leading-none text-muted-foreground">{admin?.username}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/admin/profile">Profile</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/admin/settings">Settings</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/admin/logout">Log out</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
