import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Use react-router-dom instead of next/link
import { Users, UserCog, Calendar, CreditCard, Settings, FileBarChart, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming this utility exists
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
	const { pathname } = useLocation(); 
	const [open, setOpen] = useState(false);

	return (
		<>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild className="lg:hidden">
					<Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden">
						<Menu className="h-4 w-4" />
						<span className="sr-only">Toggle Menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-[240px] p-0">
					<MobileSidebar pathname={pathname} setOpen={setOpen} />
				</SheetContent>
			</Sheet>
			<div className={cn("hidden border-r bg-background lg:block", className)}>
				<DesktopSidebar pathname={pathname} />
			</div>
		</>
	);
}

function MobileSidebar({ pathname, setOpen }: { pathname: string; setOpen: (open: boolean) => void }) {
	return (
		<div className="flex h-full flex-col">
			<div className="flex h-14 items-center border-b px-4">
				<Link to="/admin" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
					<span className="text-primary">MentorsHub</span>
					<span className="text-xs font-normal text-muted-foreground">Admin</span>
				</Link>
				<Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</Button>
			</div>
			<ScrollArea className="flex-1">
				<nav className="flex flex-col gap-2 p-2">
					{routes.map((route) => (
						<Link
							key={route.href}
							to={route.href} // Use 'to' instead of 'href' for react-router-dom
							onClick={() => setOpen(false)}
							className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", pathname === route.href && "bg-accent text-accent-foreground")}>
							<route.icon className="h-4 w-4" />
							{route.label}
						</Link>
					))}
				</nav>
			</ScrollArea>
		</div>
	);
}

function DesktopSidebar({ pathname }: { pathname: string }) {
	return (
		<div className="flex h-full w-[240px] flex-col">
			
			<ScrollArea className="flex-1">
				<nav className="flex flex-col gap-2 p-2">
					{routes.map((route) => (
						<Link
							key={route.href}
							to={route.href} // Use 'to' instead of 'href'
							className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", pathname === route.href && "bg-accent text-accent-foreground")}>
							<route.icon className="h-4 w-4" />
							{route.label}
						</Link>
					))}
				</nav>
			</ScrollArea>
		</div>
	);
}

const routes = [
	{
		label: "Dashboard",
		icon: Home,
		href: "/admin",
	},
	{
		label: "Users",
		icon: Users,
		href: "/admin/users",
	},
	{
		label: "Mentors",
		icon: UserCog,
		href: "/admin/mentors",
	},
	{
		label: "Sessions",
		icon: Calendar,
		href: "/admin/sessions",
	},
	{
		label: "Payments",
		icon: CreditCard,
		href: "/admin/payments",
	},
	{
		label: "Reports",
		icon: FileBarChart,
		href: "/admin/reports",
	},
	{
		label: "Settings",
		icon: Settings,
		href: "/admin/settings",
	},
	
];
