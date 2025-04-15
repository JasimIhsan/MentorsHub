import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Calendar, CreditCard, Settings, FileBarChart, Home, Menu, BookPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
				<SheetContent side="left" className="w-[240px] p-0 overflow-hidden">
					<MobileSidebar pathname={pathname} setOpen={setOpen} />
				</SheetContent>
			</Sheet>
			<div className={cn("hidden border-r bg-background lg:block overflow-hidden", className)}>
				<DesktopSidebar pathname={pathname} />
			</div>
		</>
	);
}

function MobileSidebar({ pathname, setOpen }: { pathname: string; setOpen: (open: boolean) => void }) {
	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="flex h-14 items-center gap-2 border-b px-4">
				<Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
					<span className="text-primary">MentorsHub</span>
					<span className="text-xs font-normal text-muted-foreground">Admin</span>
				</Link>
			</div>
			<nav className="flex flex-col gap-2 p-2 flex-1 overflow-hidden">
				{routes.map((route) => (
					<Link
						key={route.href}
						to={route.href}
						onClick={() => setOpen(false)}
						className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground", pathname === route.href && "bg-accent text-accent-foreground")}>
						<route.icon className="h-4 w-4" />
						{route.label}
					</Link>
				))}
			</nav>
		</div>
	);
}

function DesktopSidebar({ pathname }: { pathname: string }) {
	return (
		<div className="flex h-full w-[240px] flex-col overflow-hidden">
			<nav className="flex flex-col gap-2 p-2 flex-1 overflow-hidden">
				{routes.map((route) => (
					<Link
						key={route.href}
						to={route.href}
						className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-accent", pathname === route.href && "bg-primary text-accent-foreground hover:bg-primary hover:text-accent-foreground")}>
						<route.icon className="h-4 w-4" />
						{route.label}
					</Link>
				))}
			</nav>
		</div>
	);
}

const routes = [
	{
		label: "Dashboard",
		icon: Home,
		href: "/admin/dashboard",
	},
	{
		label: "Users",
		icon: Users,
		href: "/admin/users",
	},
	// {
	// 	label: "Mentors",
	// 	icon: UserCog,
	// 	href: "/admin/mentors",
	// },
	{
		label: "Mentor Applications",
		icon: BookPlus,
		href: "/admin/mentor-applications",
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
