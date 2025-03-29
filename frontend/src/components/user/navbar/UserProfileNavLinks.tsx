import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserInterface } from "@/interfaces/interfaces";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

interface UserProfileNavLinksProps {
	user: UserInterface;
}

export function UserProfileNavLinks({ user }: UserProfileNavLinksProps) {
	return (
		<div className="flex items-center gap-4 pr-10 md:pr-20 xl:pr-25 justify-center ">
			<Button variant="ghost" size="icon" className="relative">
				<Bell className="h-5 w-5" />
				<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8">
							<AvatarImage src="/placeholder.svg" alt="User" />
							<AvatarFallback>{user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.firstName + user.lastName}</p>
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
					<DropdownMenuItem className="hover:bg-red-600">
						<LogOut className="mr-2 h-4 w-4 hover:text-primary-foreground" />
						<span className="hover:text-primary-foreground">Log out</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
