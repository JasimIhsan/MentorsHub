import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatTime } from "@/utility/time-data-formater";
import { MentorApplicationFormData, WeekDay } from "@/types/mentor.application";

interface AvailabilityStepProps {
	formData: MentorApplicationFormData;
	timeArray: string[];
	handleTimeChange: (day: WeekDay, value: string) => void;
	handleRemoveTimeSlot: (day: WeekDay, index: number) => void;
}

export function AvailabilityStep({ formData, timeArray, handleTimeChange, handleRemoveTimeSlot }: AvailabilityStepProps) {
	return (
		<div className="space-y-4">
			{Object.values(WeekDay).map((day) => (
				<div key={day} className="rounded-lg border p-4">
					<h4 className="font-medium mb-2">{day}</h4>
					{(formData.availability[day] || []).length > 0 && (
						<div className="mb-4">
							<p className="text-sm font-semibold">Selected Time Slots:</p>
							<div className="flex flex-wrap gap-2 mt-2">
								{(formData.availability[day] || []).map((slot, index) => (
									<div key={index} className="flex items-center bg-gray-200/70  rounded-full px-3 py-1 text-sm">
										<span>{formatTime(slot)}</span>
										<Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0" onClick={() => handleRemoveTimeSlot(day, index)}>
											<X className="h-4 w-4" />
											<span className="sr-only">Remove {slot}</span>
										</Button>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="space-y-2">
						<Label htmlFor={`time-slot-${day}`}>Add Time Slot</Label>
						<Select onValueChange={(value) => handleTimeChange(day, value)}>
							<SelectTrigger id={`time-slot-${day}`}>
								<SelectValue placeholder="Select a time slot" />
							</SelectTrigger>
							<SelectContent>
								{timeArray.map((time) => (
									<SelectItem key={time} value={time} disabled={(formData.availability[day] || []).includes(time)}>
										{formatTime(time)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			))}
			<p className="text-xs text-gray-500">Select at least one time slot to indicate your availability. Each slot represents a one-hour session.</p>
		</div>
	);
}
