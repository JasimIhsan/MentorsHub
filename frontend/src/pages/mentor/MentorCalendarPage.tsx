import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCalendarView } from "@/components/mentor/calender/SessionCalendarView";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export function MentorCalendarPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Session Calendar</h1>
					<p className="text-muted-foreground">View and manage your upcoming sessions</p>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon">
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Previous</span>
					</Button>
					<Button variant="outline" className="min-w-[120px]">
						Today
					</Button>
					<Button variant="outline" size="icon">
						<ChevronRight className="h-4 w-4" />
						<span className="sr-only">Next</span>
					</Button>
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Add Session
					</Button>
				</div>
			</div>

			<Tabs defaultValue="week" className="space-y-4">
				<div className="flex justify-between">
					<TabsList>
						<TabsTrigger value="day">Day</TabsTrigger>
						<TabsTrigger value="week">Week</TabsTrigger>
						<TabsTrigger value="month">Month</TabsTrigger>
						<TabsTrigger value="agenda">Agenda</TabsTrigger>
					</TabsList>
				</div>

				<Card>
					<CardContent className="p-0">
						<TabsContent value="day" className="mt-0">
							<SessionCalendarView view="day" />
						</TabsContent>
						<TabsContent value="week" className="mt-0">
							<SessionCalendarView view="week" />
						</TabsContent>
						<TabsContent value="month" className="mt-0">
							<SessionCalendarView view="month" />
						</TabsContent>
						<TabsContent value="agenda" className="mt-0">
							<SessionCalendarView view="agenda" />
						</TabsContent>
					</CardContent>
				</Card>
			</Tabs>
		</div>
	);
}
