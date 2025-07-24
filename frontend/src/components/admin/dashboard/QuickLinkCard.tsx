import type React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// QuickLinkCard component
export function QuickLinkCard({ title, description, href, icon: Icon }: { title: string; description: string; href: string; icon: React.ElementType }) {
	return (
		<Card className="overflow-hidden py-0">
			<Link to={href} className="block h-full">
				<CardContent className="px-6 pt-6">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
							<Icon className="h-6 w-6 text-primary" />
						</div>
						<ArrowUpRight className="h-5 w-5 text-muted-foreground" />
					</div>
					<div className="mt-4">
						<h3 className="font-semibold">{title}</h3>
						<p className="mt-1 text-sm text-muted-foreground">{description}</p>
					</div>
				</CardContent>
			</Link>
		</Card>
	);
}
