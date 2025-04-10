import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { UserInterface } from "@/interfaces/interfaces";

interface SessionHistorySectionProps {
	user: UserInterface;
	pastSessions: any[];
	upcomingSessions: any[];
}

export function SessionHistorySection({ user, pastSessions, upcomingSessions }: SessionHistorySectionProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Session History</CardTitle>
				<CardDescription>Track your mentoring sessions</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="completed">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="completed">Completed ({user?.sessionCompleted || 0})</TabsTrigger>
						<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
					</TabsList>
					<TabsContent value="completed" className="mt-4 space-y-4">
						{pastSessions.length > 0 ? (
							<p className="text-muted-foreground">Session rendering logic goes here</p>
						) : (
							<div className="text-muted-foreground flex items-center gap-2">
								<Info className="h-4 w-4" />
								<p>No completed sessions yet.</p>
							</div>
						)}
					</TabsContent>
					<TabsContent value="upcoming" className="mt-4 space-y-4">
						{upcomingSessions.length > 0 ? (
							<p className="text-muted-foreground">Session rendering logic goes here</p>
						) : (
							<div className="text-muted-foreground flex items-center gap-2">
								<Info className="h-4 w-4" />
								<p>No upcoming sessions scheduled.</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
