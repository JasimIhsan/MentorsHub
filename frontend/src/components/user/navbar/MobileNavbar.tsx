"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MobileNav() {
	const [open, setOpen] = useState(false);
	const location = useLocation();
	const pathname = location.pathname;

	const routes = [
		{
			to: "/dashboard",
			label: "Dashboard",
		},
		{
			to: "/browse",
			label: "Browse Mentors",
		},
		{
			to: "/sessions",
			label: "Sessions",
		},
		{
			to: "/messages",
			label: "Messages",
		},
		{
			to: "/profile",
			label: "Profile",
		},
		{
			to: "/settings",
			label: "Settings",
		},
	];

	return (
		<div className="md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="pr-0">
					<div className="px-7">
						<Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
							<Avatar className="h-8 w-8">
								<AvatarImage src="/placeholder.svg" alt="User" />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
							<span className="font-bold">John Doe</span>
						</Link>
					</div>
					<nav className="mt-8 flex flex-col gap-4">
						{routes.map((route) => (
							<Link key={route.to} to={route.to} onClick={() => setOpen(false)} className={cn("px-7 py-2 text-base font-medium transition-colors hover:text-primary", pathname === route.to ? "text-primary" : "text-muted-foreground")}>
								{route.label}
							</Link>
						))}
						<div className="px-7 pt-4">
							<Button className="w-full" variant="destructive">
								Log out
							</Button>
						</div>
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	);
}
