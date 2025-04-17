import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SessionCalendarPreview() {
	// This is a simplified calendar preview component
	// In a real implementation, you would use a library like FullCalendar

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

	// Sample events
	const events = [
		{ day: 1, hour: 10, title: "Maria Garcia", duration: 1, type: "confirmed" },
		{ day: 1, hour: 14, title: "James Wilson", duration: 1, type: "confirmed" },
		{ day: 2, hour: 11, title: "Emily Davis", duration: 0.5, type: "confirmed" },
		{ day: 3, hour: 13, title: "Alex Johnson", duration: 1, type: "pending" },
		{ day: 4, hour: 15, title: "Sarah Williams", duration: 1, type: "pending" },
		{ day: 5, hour: 9, title: "Michael Chen", duration: 1.5, type: "confirmed" },
	];

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="font-medium">July 15-21, 2024</h3>
				<div className="flex items-center gap-1">
					<Button variant="outline" size="icon" className="h-8 w-8">
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Previous week</span>
					</Button>
					<Button variant="outline" size="icon" className="h-8 w-8">
						<ChevronRight className="h-4 w-4" />
						<span className="sr-only">Next week</span>
					</Button>
				</div>
			</div>

			<div className="border rounded-md overflow-hidden">
				{/* Calendar header */}
				<div className="grid grid-cols-7 border-b">
					{days.map((day) => (
						<div key={day} className="p-2 text-center text-sm font-medium border-r last:border-r-0">
							{day}
						</div>
					))}
				</div>

				{/* Calendar body */}
				<div className="relative grid grid-cols-7 h-[300px]">
					{/* Time indicators */}
					<div className="absolute left-0 top-0 h-full w-full">
						{hours.map((hour, index) => (
							<div key={hour} className="absolute left-0 right-0 border-t text-xs text-muted-foreground" style={{ top: `${(index / hours.length) * 100}%` }}>
								<span className="absolute -top-2.5 -left-2 bg-background px-1">{hour}:00</span>
							</div>
						))}
					</div>

					{/* Day columns */}
					{Array.from({ length: 7 }).map((_, dayIndex) => (
						<div key={dayIndex} className="relative h-full border-r last:border-r-0">
							{/* Events */}
							{events
								.filter((event) => event.day === dayIndex + 1)
								.map((event, eventIndex) => {
									const top = ((event.hour - hours[0]) / (hours[hours.length - 1] - hours[0] + 1)) * 100;
									const height = (event.duration / (hours[hours.length - 1] - hours[0] + 1)) * 100;

									return (
										<div
											key={eventIndex}
											className={`absolute left-1 right-1 rounded-md p-1 text-xs ${event.type === "confirmed" ? "bg-primary/10 border border-primary/20" : "bg-muted border border-muted-foreground/20"}`}
											style={{ top: `${top}%`, height: `${height}%` }}>
											<div className="font-medium truncate">{event.title}</div>
											<div className="truncate">{`${event.hour}:00 - ${event.hour + event.duration}:${event.duration % 1 === 0 ? "00" : "30"}`}</div>
											{event.type === "pending" && (
												<Badge variant="outline" className="mt-1 h-4 text-[10px]">
													Pending
												</Badge>
											)}
										</div>
									);
								})}
						</div>
					))}
				</div>
			</div>

			<div className="flex justify-center">
				<Button>Open Full Calendar</Button>
			</div>
		</div>
	);
}
