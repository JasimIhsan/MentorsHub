import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface CustomCalendarProps {
	selectedDate: Date | null;
	setSelectedDate: (date: Date | null) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ selectedDate, setSelectedDate }) => {
	const [currentDate, setCurrentDate] = useState<Date>(new Date());

	const daysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();
	const firstDayOfMonth = (year: number, month: number): number => new Date(year, month, 1).getDay();

	const year: number = currentDate.getFullYear();
	const month: number = currentDate.getMonth();
	const totalDays: number = daysInMonth(year, month);
	const startingDay: number = firstDayOfMonth(year, month);

	const prevMonth = (): void => {
		setCurrentDate(new Date(year, month - 1, 1));
	};

	const nextMonth = (): void => {
		setCurrentDate(new Date(year, month + 1, 1));
	};

	const goToToday = (): void => {
		const today = new Date();
		setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
		setSelectedDate(today);
	};

	const handleDateClick = (day: number): void => {
		const newDate = new Date(year, month, day);
		// Only allow selecting dates that are today or in the future
		if (newDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
			setSelectedDate(newDate);
		}
	};

	const renderDays = (): React.ReactElement[] => {
		const days: React.ReactElement[] = [];
		const today: Date = new Date(new Date().setHours(0, 0, 0, 0));

		// Empty slots for days before the first day of the month
		for (let i = 0; i < startingDay; i++) {
			days.push(<div key={`empty-${i}`} className="p-2"></div>);
		}

		// Days of the month
		for (let day = 1; day <= totalDays; day++) {
			const date = new Date(year, month, day);
			const isSelected: boolean = selectedDate !== null && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
			const isToday: boolean = date.toDateString() === today.toDateString();
			const isDisabled: boolean = date < today;

			days.push(
				<div
					key={day}
					className={`p-2 text-center rounded-full 
                        ${isDisabled ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"} 
                        ${isSelected ? "bg-primary ring-2 ring-blue-500 ring-offset-1 text-white" : ""} 
                        ${isToday ? "border-2 border-primary" : ""} 
                        ${!isDisabled && !isSelected ? "hover:bg-blue-100" : ""}`}
					onClick={() => !isDisabled && handleDateClick(day)}>
					{day}
				</div>
			);
		}

		return days;
	};

	return (
		<div className="bg-white p-6 rounded-lg border w-80">
			<div className="flex justify-between items-center mb-4">
				<Button onClick={prevMonth} variant="ghost">
					<ArrowLeft />
				</Button>
				<h2 className="text-lg font-semibold">{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
				<Button onClick={nextMonth} variant="ghost">
					<ArrowRight />
				</Button>
			</div>
			<div className="grid grid-cols-7 gap-1 text-center text-sm">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div key={day} className="font-semibold text-gray-600">
						{day}
					</div>
				))}
				{renderDays()}
			</div>
			<div className="mt-4 flex justify-end items-center">
				<Button onClick={goToToday} variant="link">
					Today
				</Button>
			</div>
		</div>
	);
};

export { CustomCalendar };
