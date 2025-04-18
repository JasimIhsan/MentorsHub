import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Logo from "@/assets/logo.png.png";

export function MentorHeader() {
	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center px-4 md:px-6">
			<div className="flex items-center gap-2 cursor-pointer">
				{/* <GraduationCap className="h-6 w-6" /> */}
				<div className="w-8">
					<img src={Logo} alt="" className="w-full" />
				</div>
				<span className="hidden font-bold sm:inline-block">MentorsHub</span>
			</div>

				{/* Search - Full on desktop, icon on mobile */}
				<div className="ml-auto flex items-center gap-4">
					{/* <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
						<Search className="h-5 w-5" />
						<span className="sr-only">Search</span>
					</Button> */}

					{/* Quick Calendar Button */}
					<Button variant="outline" size="icon">
						<Calendar className="h-5 w-5" />
						<span className="sr-only">Calendar</span>
					</Button>

					{/* Notifications */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="relative">
								<Bell className="h-5 w-5" />
								<Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">3</Badge>
								<span className="sr-only">Notifications</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-80">
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="max-h-80 overflow-auto">
								<NotificationItem title="New Session Request" description="Alex Johnson requested a session on React Fundamentals" time="5 minutes ago" type="request" />
								<NotificationItem title="Session Reminder" description="Upcoming session with Maria Garcia in 1 hour" time="25 minutes ago" type="reminder" />
								<NotificationItem title="New Review" description="David Lee left a 5-star review for your last session" time="2 hours ago" type="review" />
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="cursor-pointer justify-center text-center">View all notifications</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative h-10 w-10 rounded-full">
								<Avatar className="h-10 w-10">
									<AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
									<AvatarFallback>MH</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuItem>Earnings</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Log out</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}

function NotificationItem({ title, description, time, type }: { title: string; description: string; time: string; type: "request" | "reminder" | "review" | "other" }) {
	const icons = {
		request: <Calendar className="h-5 w-5 text-blue-500" />,
		reminder: <Bell className="h-5 w-5 text-amber-500" />,
		review: <Star className="h-5 w-5 text-green-500" />,
		other: <Info className="h-5 w-5 text-gray-500" />,
	};

	return (
		<div className="flex items-start gap-3 p-3 hover:bg-muted cursor-pointer">
			<div className="mt-1">{icons[type]}</div>
			<div className="flex-1 space-y-1">
				<p className="text-sm font-medium">{title}</p>
				<p className="text-xs text-muted-foreground">{description}</p>
				<p className="text-xs text-muted-foreground">{time}</p>
			</div>
		</div>
	);
}

// Import this at the top of the file
import { Info, Star } from "lucide-react";
