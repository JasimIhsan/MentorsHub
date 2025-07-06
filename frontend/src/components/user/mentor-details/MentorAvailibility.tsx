import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { IMentorDTO, WeekDay } from "@/interfaces/IMentorDTO";
import { formatTime } from "@/utility/time-data-formatter";

interface MentorAvailabilityProps {
	mentor: IMentorDTO;
	selectedDay: WeekDay;
	setSelectedDay: (day: WeekDay) => void;
}

export function MentorAvailability({ mentor, setSelectedDay }: MentorAvailabilityProps) {
	return (
		<Card className="w-full shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-gray-800">Available Time Slots</CardTitle>
				<CardDescription className="text-gray-600">View the mentor's available times for sessions</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue={WeekDay.Monday} onValueChange={(value) => setSelectedDay(value as WeekDay)}>
					<TabsList className="grid w-full grid-cols-7 gap-2 mb-6">
						{Object.values(WeekDay).map((day, index) => (
							<div key={day} className="relative flex items-center">
								<TabsTrigger value={day} className="text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-indigo-100 relative w-full">
									{day.slice(0, 3)}
									{mentor.availability[day]?.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full" />}
								</TabsTrigger>
								{index < Object.values(WeekDay).length - 1 && <span className="absolute right-[-8px] text-gray-300">|</span>}
							</div>
						))}
					</TabsList>
					{Object.entries(mentor.availability).map(([day, times]) => (
						<TabsContent key={day} value={day} className="min-h-[150px]">
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
								{times.length > 0 ? (
									times.map((time) => (
										<div key={`${day}-${time}`} className="flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md bg-gray-50">
											<Clock className="h-4 w-4 text-primary" />
											<span className="text-sm font-medium">{formatTime(time)}</span>
										</div>
									))
								) : (
									<p className="col-span-2 sm:col-span-3 text-gray-500 italic">No availability on {day}</p>
								)}
							</div>
						</TabsContent>
					))}
				</Tabs>
				<div className="mt-8">
					<Button className="w-full" asChild disabled={!mentor.userId}>
						<Link to={`/request-session/${mentor.userId}`}>Request Session</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
