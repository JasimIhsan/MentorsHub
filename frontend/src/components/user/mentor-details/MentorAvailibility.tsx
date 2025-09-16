import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";
import { WeekDay } from "@/interfaces/mentor.interface";
import { formatTime } from "@/utility/time-data-formatter";
import { convertUTCtoLocal } from "@/utility/time-converter/utcToLocal";

interface AvailabilitySlot {
	id: string;
	dayOfWeek?: number;
	date?: string;
	startTime: string;
	endTime: string;
}

interface MentorAvailabilityProps {
	selectedDay: WeekDay;
	setSelectedDay: (day: WeekDay) => void;
	availabilityData?: {
		weekly: AvailabilitySlot[];
		special: AvailabilitySlot[];
	};
}

// Helper function to format date
const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
};

// Map dayOfWeek numbers to WeekDay enum
const dayOfWeekMap: { [key: number]: WeekDay } = {
	0: WeekDay.Sunday,
	1: WeekDay.Monday,
	2: WeekDay.Tuesday,
	3: WeekDay.Wednesday,
	4: WeekDay.Thursday,
	5: WeekDay.Friday,
	6: WeekDay.Saturday,
};

export function MentorAvailability({ selectedDay, setSelectedDay, availabilityData }: MentorAvailabilityProps) {
	// Initialize empty object if no availability data for weekly slots
	const weeklyAvailability =
		availabilityData?.weekly?.reduce((acc, slot) => {
			const day = dayOfWeekMap[slot.dayOfWeek!];
			if (!acc[day]) acc[day] = [];
			const {startTime, endTime} = convertUTCtoLocal(slot.startTime, slot.endTime)
			acc[day].push({
				startTime,
				endTime,
				dayOfWeek: slot.dayOfWeek!,
			});
			return acc;
		}, {} as Record<WeekDay, { startTime: string; endTime: string; dayOfWeek: number }[]>) || ({} as Record<WeekDay, { startTime: string; endTime: string; dayOfWeek: number }[]>);

	// Initialize empty object if no special availability
	const specialAvailability =
		availabilityData?.special?.reduce((acc, slot) => {
			const date = slot.date!.split("T")[0];
			if (!acc[date]) acc[date] = [];
			const {startTime, endTime, date: localDate} = convertUTCtoLocal(slot.startTime, slot.endTime, slot.date)
			acc[date].push({
				startTime,
				endTime,
				date: localDate,
			});
			return acc;
		}, {} as Record<string, { startTime: string; endTime: string; date: string }[]>) || ({} as Record<string, { startTime: string; endTime: string; date: string }[]>);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Weekly Availability Section */}
				<Card className="w-full shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-gray-800">Regular Availability</CardTitle>
						<CardDescription className="text-gray-600">Recurring regular time slots</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as WeekDay)}>
							<TabsList className="grid w-full grid-cols-7 gap-2 mb-6">
								{Object.values(WeekDay).map((day, index) => (
									<div key={day} className="relative flex items-center">
										<TabsTrigger value={day} className="text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white hover:bg-indigo-100 relative w-full rounded-md py-1">
											{day.slice(0, 3)}
											{weeklyAvailability[day]?.length > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full" />}
										</TabsTrigger>
										{index < Object.values(WeekDay).length - 1 && <span className="absolute right-[-8px] text-gray-300">|</span>}
									</div>
								))}
							</TabsList>
							{Object.values(WeekDay).map((day) => (
								<TabsContent key={day} value={day} className="min-h-[150px]">
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
										{weeklyAvailability[day]?.length > 0 ? (
											weeklyAvailability[day].map((slot, index) => (
												<div key={`${day}-${slot.startTime}-${slot.endTime}-${index}`} className="flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-indigo-50 transition-colors">
													<Clock className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium">{`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}</span>
												</div>
											))
										) : (
											<p className="col-span-full text-gray-500 italic">No availability on {day}</p>
										)}
									</div>
								</TabsContent>
							))}
						</Tabs>
					</CardContent>
				</Card>

				{/* Special Availability Section */}
				<Card className="w-full shadow-lg">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-gray-800">Special Availability</CardTitle>
						<CardDescription className="text-gray-600">One-time slots for specific dates</CardDescription>
					</CardHeader>
					<CardContent>
						{Object.keys(specialAvailability).length > 0 ? (
							<div className="space-y-6">
								{Object.entries(specialAvailability).map(([date, slots]) => (
									<div key={date} className="border-b pb-4 last:border-b-0">
										<div className="flex items-center gap-2 mb-3">
											<Calendar className="h-5 w-5 text-primary" />
											<h3 className="text-lg font-semibold">{formatDate(date)}</h3>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
											{slots.map((slot, index) => (
												<div key={`${date}-${slot.startTime}-${slot.endTime}-${index}`} className="flex items-center justify-start gap-2 px-4 py-2 border border-gray-200 rounded-md bg-gray-50 hover:bg-indigo-50 transition-colors">
													<Clock className="h-4 w-4 text-primary" />
													<span className="text-sm font-medium">{`${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`}</span>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-gray-500 italic">No special availability</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
