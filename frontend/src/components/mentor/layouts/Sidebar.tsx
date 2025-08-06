import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ClipboardList, Star, Users, Menu, BarChart3, BookOpenText, Clock } from "lucide-react";

interface Route {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	href: string;
	active: boolean;
}

export function MentorSidebar() {
	const { pathname } = useLocation(); // Destructure pathname
	const [open, setOpen] = useState(false);

	const routes: Route[] = [
		{
			title: "Dashboard",
			icon: BarChart3,
			href: "/mentor/dashboard",
			active: pathname === "/mentor/dashboard",
		},
		{
			title: "Requests",
			icon: ClipboardList,
			href: "/mentor/requests",
			active: pathname === "/mentor/requests",
		},
		{
			title: "Session History",
			icon: BookOpenText,
			href: "/mentor/session-history",
			active: pathname === "/mentor/session-history",
		},
		{
			title: "Upcoming Sessions",
			icon: Users,
			href: "/mentor/upcoming-sessions",
			active: pathname === "/mentor/upcoming-sessions",
		},
		// {
		// 	title: "Calendar",
		// 	icon: Calendar,
		// 	href: "/mentor/calendar",
		// 	active: pathname === "/mentor/calendar",
		// },
		{
			title: "Availability",
			icon: Clock,
			href: "/mentor/availability",
			active: pathname === "/mentor/availability",
		},
		// {
		// 	title: "Premium Plans",
		// 	icon: CreditCard,
		// 	href: "/mentor/plans",
		// 	active: pathname === "/mentor/plans",
		// },

		{
			title: "Reviews",
			icon: Star,
			href: "/mentor/reviews",
			active: pathname === "/mentor/reviews",
		},
		// {
		// 	title: "Messages",
		// 	icon: MessageSquare,
		// 	href: "/mentor/messages",
		// 	active: pathname === "/mentor/messages",
		// },
		// {
		// 	title: "Settings",
		// 	icon: Settings,
		// 	href: "/mentor/settings",
		// 	active: pathname === "/mentor/settings",
		// },
	];

	return (
		<>
			{/* Mobile Trigger */}
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild className="lg:hidden absolute left-4 top-4 z-50">
					<Button variant="outline" size="icon">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="p-0 w-72">
					<MobileSidebar routes={routes} pathname={pathname} setOpen={setOpen} />
				</SheetContent>
			</Sheet>

			{/* Desktop Sidebar */}
			<div className="hidden lg:flex lg:flex-col lg:w-65 lg:border-r">
				<ScrollArea className="flex-1 py-4">
					<nav className="px-4 space-y-1">
						{routes.map((route) => (
							<Link key={route.href} to={route.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
								<route.icon className="h-5 w-5" />
								{route.title}
							</Link>
						))}
					</nav>
				</ScrollArea>
				<div className="p-4 border-t">
					<div className="flex items-center gap-3 px-3 py-2">
						<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
							<Users className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium">23 Active Mentees</p>
							<p className="text-xs text-muted-foreground">4 sessions today</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function MobileSidebar({ routes, setOpen }: { routes: Route[]; pathname: string; setOpen: (open: boolean) => void }) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center justify-between p-6 border-b">
				<h2 className="text-2xl font-semibold">MentorsHub</h2>
				{/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
					<X className="h-5 w-5" />
				</Button> */}
			</div>
			<ScrollArea className="flex-1 py-4">
				<nav className="px-4 space-y-1">
					{routes.map((route) => (
						<Link
							key={route.href}
							to={route.href}
							onClick={() => setOpen(false)}
							className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
							<route.icon className="h-5 w-5" />
							{route.title}
						</Link>
					))}
				</nav>
			</ScrollArea>
			<div className="p-4 border-t">
				<div className="flex items-center gap-3 px-3 py-2">
					<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
						<Users className="h-5 w-5 text-primary" />
					</div>
					<div>
						<p className="text-sm font-medium">23 Active Mentees</p>
						<p className="text-xs text-muted-foreground">4 sessions today</p>
					</div>
				</div>
			</div>
		</div>
	);
}
