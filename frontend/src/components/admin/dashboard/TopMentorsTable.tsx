import { Star, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminDashboardMentor } from "@/interfaces/admin.dashboard.interfaces";

// TopMentorsTable component
export function TopMentorsTable({ topMentors }: { topMentors: AdminDashboardMentor[] }) {
	return (
		<Card className="lg:col-span-4">
			<CardHeader>
				<CardTitle>Top Mentors</CardTitle>
				<CardDescription>Performance metrics for top-performing mentors</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Mentor</TableHead>
							<TableHead>Sessions</TableHead>
							<TableHead>Rating</TableHead>
							<TableHead>Revenue</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{topMentors.map((mentor) => (
							<TableRow key={mentor.id}>
								<TableCell className="font-medium flex items-center gap-2">
									<Avatar>
										<AvatarImage src={mentor.avatar} />
										<AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
									</Avatar>
									{mentor.name}
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Clock className="h-4 w-4 text-muted-foreground" />
										{mentor.sessions}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Star className="h-4 w-4 text-yellow-400" />
										{mentor.rating}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<DollarSign className="h-4 w-4 text-green-600" />
										{mentor.revenue}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
