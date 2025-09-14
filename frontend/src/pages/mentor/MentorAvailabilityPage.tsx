import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
	addWeeklySlotAPI,
	deleteWeeklySlotAPI,
	toggleWeeklySlotActiveAPI,
	updateWeeklySlotAPI,
	toggleWeeklySlotByWeekDayAPI,
	fetchWeeklySlotsAPI,
	addDateSlotAPI,
	fetchDateSlotsAPI,
	updateDateSlotAPI,
	deleteDateSlotAPI,
} from "@/api/mentor.availability.api.service";
import { toast } from "sonner";
import { convertUTCtoLocal } from "@/utility/time-converter/utcToLocal";
import { convertLocaltoUTC } from "@/utility/time-converter/localToUTC";

// Interfaces
interface IWeeklyAvailability {
	id: string;
	startTime: string;
	endTime: string;
	isActive: boolean;
}
interface IDateSlot {
	id: string;
	mentorId: string;
	date: string;
	startTime: string;
	endTime: string;
}

interface IDayAvailability {
	unavailable: boolean;
	slots: IWeeklyAvailability[];
}

interface IDateAvailability {
	[date: string]: { slots: IDateSlot[] };
}

interface IWeeklyAvailability {
	id: string;
	mentorId: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

interface EditSlot {
	day: string;
	slotId: string;
	startTime: string;
	endTime: string;
	isWeekly: boolean;
}

// Constants
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const days: Record<number, string> = {
	0: "Sunday",
	1: "Monday",
	2: "Tuesday",
	3: "Wednesday",
	4: "Thursday",
	5: "Friday",
	6: "Saturday",
};

// Utility Functions
const initializeWeeklySlots = (): Record<string, IDayAvailability> => ({
	"0": { unavailable: true, slots: [] },
	"1": { unavailable: false, slots: [] },
	"2": { unavailable: false, slots: [] },
	"3": { unavailable: true, slots: [] },
	"4": { unavailable: true, slots: [] },
	"5": { unavailable: true, slots: [] },
	"6": { unavailable: true, slots: [] },
});

const calculateEndTime = (startTime: string): string => {
	const [hours, minutes] = startTime.split(":");
	let newHours = parseInt(hours, 10) + 1;
	if (newHours === 24) newHours = 0;
	return `${newHours.toString().padStart(2, "0")}:${minutes}`;
};

const doSlotsOverlap = (newSlot: { startTime: string; endTime: string }, existingSlot: IWeeklyAvailability | IDateSlot): boolean => {
	const newStart = new Date(`2000-01-01T${newSlot.startTime}:00`);
	const newEnd = new Date(`2000-01-01T${newSlot.endTime}:00`);
	const existingStart = new Date(`2000-01-01T${existingSlot.startTime}:00`);
	const existingEnd = new Date(`2000-01-01T${existingSlot.endTime}:00`);

	return newStart < existingEnd && newEnd > existingStart;
};

// Sort slots by startTime
const sortWeeklySlotsByStartTime = (slots: IWeeklyAvailability[]): IWeeklyAvailability[] => {
	return [...slots].sort((a, b) => {
		const [aHours, aMinutes] = a.startTime.split(":").map(Number);
		const [bHours, bMinutes] = b.startTime.split(":").map(Number);
		const aTotalMinutes = aHours * 60 + aMinutes;
		const bTotalMinutes = bHours * 60 + bMinutes;
		return aTotalMinutes - bTotalMinutes;
	});
};

const sortDateSlotsByStartTime = (slots: IDateSlot[]): IDateSlot[] => {
	return [...slots].sort((a, b) => {
		const [aHours, aMinutes] = a.startTime.split(":").map(Number);
		const [bHours, bMinutes] = b.startTime.split(":").map(Number);
		const aTotalMinutes = aHours * 60 + aMinutes;
		const bTotalMinutes = bHours * 60 + bMinutes;
		return aTotalMinutes - bTotalMinutes;
	});
};

// Determine if a day is available based on active slots
const isDayAvailable = (slots: IWeeklyAvailability[]): boolean => {
	return slots.some((slot) => slot.isActive);
};

export function MentorAvailabilityPage() {
	const [weeklySlots, setWeeklySlots] = useState<Record<string, IDayAvailability>>(initializeWeeklySlots());
	const [dateSlots, setDateSlots] = useState<IDateAvailability>({});
	const [editSlot, setEditSlot] = useState<EditSlot | null>(null);
	const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
	const [isDateModalOpen, setIsDateModalOpen] = useState(false);
	const [newWeeklySlot, setNewWeeklySlot] = useState({ day: "", startTime: "09:00", endTime: "10:00" });
	const [newDateSlot, setNewDateSlot] = useState({ date: "", startTime: "09:00", endTime: "10:00" });
	const user = useSelector((state: RootState) => state.userAuth.user);

	// Fetch weekly slots
	const fetchWeeklySlots = useCallback(async () => {
		if (!user?.id) return;

		try {
			const response = await fetchWeeklySlotsAPI(user.id);
			if (response.success) {
				const newSlots = initializeWeeklySlots();
				response.slots.forEach((slot: IWeeklyAvailability) => {
					const { startTime, endTime } = convertUTCtoLocal(slot.startTime, slot.endTime);
					const day = slot.dayOfWeek.toString();
					newSlots[day].slots.push({ ...slot, startTime, endTime });
					newSlots[day].unavailable = !isDayAvailable(newSlots[day].slots);
				});
				setWeeklySlots(newSlots);
			}
		} catch (error) {
			console.error("Error fetching weekly slots:", error);
		}
	}, [user?.id]);

	// Fetch date-specific slots
	const fetchDateSlots = useCallback(async () => {
		if (!user?.id) return;

		try {
			const response = await fetchDateSlotsAPI(user.id);
			if (response.success) {
				const newDateSlots: IDateAvailability = {};

				response.slots.forEach((slot: IDateSlot) => {
					// Convert UTC -> local time
					const { startTime, endTime, date: localDateStr } = convertUTCtoLocal(slot.startTime, slot.endTime, new Date(slot.date));

					// Use localDateStr as key for easier UI grouping
					const slotDateKey = localDateStr; // "YYYY-MM-DD"

					if (!newDateSlots[slotDateKey]) {
						newDateSlots[slotDateKey] = { slots: [] };
					}

					newDateSlots[slotDateKey].slots.push({
						id: slot.id,
						mentorId: slot.mentorId,
						date: localDateStr, // already formatted as "YYYY-MM-DD"
						startTime,
						endTime,
					});
				});

				// Optional: Sort the slots for each date by startTime
				Object.keys(newDateSlots).forEach((date) => {
					newDateSlots[date].slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
				});

				// Optional: Sort the entire dateSlots object by date
				const sortedDateSlots: IDateAvailability = {};
				Object.keys(newDateSlots)
					.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
					.forEach((date) => {
						sortedDateSlots[date] = newDateSlots[date];
					});

				setDateSlots(sortedDateSlots);
			}
		} catch (error) {
			console.error("Error fetching date slots:", error);
			toast.error("Failed to fetch date-specific slots.");
		}
	}, [user?.id]);

	useEffect(() => {
		fetchWeeklySlots();
		fetchDateSlots();
	}, [fetchWeeklySlots, fetchDateSlots]);

	// Toggle day availability and update all slots' isActive via API
	const handleToggleAvailability = async (day: string, checked: boolean) => {
		if (!user?.id) return;

		if (checked && weeklySlots[day].slots.length === 0) {
			toast.error(`Cannot activate ${days[parseInt(day)]}. Please add at least one slot first.`);
			return;
		}

		try {
			const response = await toggleWeeklySlotByWeekDayAPI(user.id, parseInt(day), checked);
			if (response.success) {
				setWeeklySlots((prev) => ({
					...prev,
					[day]: {
						...prev[day],
						unavailable: !checked,
						slots: prev[day].slots.map((slot) => ({
							...slot,
							isActive: checked,
						})),
					},
				}));
				toast.success(`Day ${days[parseInt(day)]} set to ${checked ? "available" : "unavailable"}.`);
			}
		} catch (error) {
			console.error("Error toggling day availability:", error);
			if (error instanceof Error) toast.error(error.message);
		}
	};

	const handleAddWeeklySlotModal = (day: string) => {
		setNewWeeklySlot({ day, startTime: "09:00", endTime: "10:00" });
		setIsWeeklyModalOpen(true);
	};

	const handleWeeklyStartTimeChange = (startTime: string) => {
		setNewWeeklySlot((prev) => ({
			...prev,
			startTime,
			endTime: calculateEndTime(startTime),
		}));
	};

	const handleDateStartTimeChange = (startTime: string) => {
		setNewDateSlot((prev) => ({
			...prev,
			startTime,
			endTime: calculateEndTime(startTime),
		}));
	};

	const handleSaveWeeklySlot = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.id) return;

		const utcSlot = convertLocaltoUTC(newWeeklySlot.startTime, newWeeklySlot.endTime); // no date for weekly
		const slot = {
			day: newWeeklySlot.day,
			startTime: utcSlot.startTime,
			endTime: utcSlot.endTime,
		};
		console.log(`slot: `, slot);

		const existingSlots = weeklySlots[newWeeklySlot.day].slots;
		const hasOverlap = existingSlots.some((existingSlot) => doSlotsOverlap(slot, existingSlot));

		if (hasOverlap) {
			toast.error("The new slot overlaps with an existing slot.");
			return;
		}

		try {
			const response = await addWeeklySlotAPI(user.id, slot);
			if (response.success) {
				setWeeklySlots((prev) => {
					const updatedSlots = {
						...prev,
						[newWeeklySlot.day]: {
							unavailable: false,
							slots: [...prev[newWeeklySlot.day].slots, { ...response.slot, startTime: newWeeklySlot.startTime, endTime: newWeeklySlot.endTime, isActive: true }],
						},
					};
					return updatedSlots;
				});
				setIsWeeklyModalOpen(false);
				setNewWeeklySlot({ day: "", startTime: "09:00", endTime: "10:00" });
				toast.success("Weekly slot added successfully.");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message.includes("overlaps") ? "This slot overlaps with an existing slot." : "Failed to add slot. Please try again.");
			}
			console.error("Error saving weekly slot:", error);
		}
	};

	// Toggle isActive for a weekly slot
	const handleToggleWeeklySlotActive = async (day: string, slotId: string, isActive: boolean) => {
		try {
			const response = await toggleWeeklySlotActiveAPI(user?.id as string, slotId);
			if (response.success) {
				setWeeklySlots((prev) => {
					const updatedSlots = {
						...prev,
						[day]: {
							...prev[day],
							slots: prev[day].slots.map((slot) => (slot.id === slotId ? { ...slot, isActive } : slot)),
							unavailable: !prev[day].slots.some((slot) => (slot.id === slotId ? isActive : slot.isActive)),
						},
					};
					return updatedSlots;
				});
				toast.success(`Slot ${isActive ? "activated" : "deactivated"} successfully.`);
			}
		} catch (error) {
			console.error("Error toggling weekly slot active status:", error);
			if (error instanceof Error) toast.error(error.message);
		}
	};

	const handleAddDateSlot = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user?.id) return;

		const utcSlot = convertLocaltoUTC(newDateSlot.startTime, newDateSlot.endTime, new Date(newDateSlot.date));
		const slot = {
			date: utcSlot.date?.toISOString().substring(0, 10)!,
			startTime: utcSlot.startTime,
			endTime: utcSlot.endTime,
		};

		console.log(`slot: `, slot);

		try {
			const response = await addDateSlotAPI(user.id, slot);
			if (response.success) {
				const newSlot = response.slot;
				console.log("newSlot: ", newSlot);
				setDateSlots((prev) => {
					const updatedSlots = { ...prev };
					if (!updatedSlots[newDateSlot.date]) {
						updatedSlots[newDateSlot.date] = { slots: [] };
					}
					updatedSlots[newDateSlot.date].slots = [
						...updatedSlots[newDateSlot.date].slots,
						{
							id: newSlot.id,
							mentorId: newSlot.mentorId,
							startTime: newDateSlot.startTime,
							endTime: newDateSlot.endTime,
							date: newDateSlot.date,
						},
					];
					updatedSlots[newDateSlot.date].slots = sortDateSlotsByStartTime(updatedSlots[newDateSlot.date].slots);
					const sortedDateSlots: IDateAvailability = {};
					Object.keys(updatedSlots)
						.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
						.forEach((date) => {
							sortedDateSlots[date] = updatedSlots[date];
						});
					return sortedDateSlots;
				});
				setIsDateModalOpen(false);
				setNewDateSlot({ date: "", startTime: "09:00", endTime: "10:00" });
				toast.success("Date-specific slot added successfully.");
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
			console.error("Error saving date slot:", error);
		}
	};

	const handleRemoveSlot = async (key: string, slotId: string, isWeekly: boolean) => {
		if (isWeekly) {
			try {
				const response = await deleteWeeklySlotAPI(user?.id as string, slotId);
				if (response.success) {
					setWeeklySlots((prev) => {
						const updatedSlots = {
							...prev,
							[key]: {
								...prev[key],
								slots: prev[key].slots.filter((slot) => slot.id !== slotId),
								unavailable: !prev[key].slots.filter((slot) => slot.id !== slotId).some((slot) => slot.isActive),
							},
						};
						return updatedSlots;
					});
					toast.success("Slot removed successfully.");
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		} else {
			try {
				const response = await deleteDateSlotAPI(user?.id as string, slotId);
				if (response.success) {
					setDateSlots((prev) => {
						const updatedSlots = {
							...prev,
							[key]: {
								...prev[key],
								slots: prev[key].slots.filter((slot) => slot.id !== slotId),
							},
						};
						// Remove date entry if no slots remain
						if (updatedSlots[key].slots.length === 0) {
							delete updatedSlots[key];
						}
						// Sort the updatedSlots by date
						const sortedDateSlots: IDateAvailability = {};
						Object.keys(updatedSlots)
							.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
							.forEach((date) => {
								sortedDateSlots[date] = updatedSlots[date];
							});
						return sortedDateSlots;
					});
					toast.success("Slot removed successfully.");
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		}
	};

	const handleEditSlot = (key: string, slotId: string, startTime: string, _endTime: string, isWeekly: boolean) => {
		setEditSlot({ day: key, slotId, startTime, endTime: calculateEndTime(startTime), isWeekly });
	};

	const handleSaveEdit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!editSlot) return;

		const updatedSlot = {
			...editSlot,
			endTime: calculateEndTime(editSlot.startTime),
		};

		// Check for overlaps when editing
		if (editSlot.isWeekly) {
			const existingSlots = weeklySlots[editSlot.day].slots.filter((slot) => slot.id !== editSlot.slotId);
			const hasOverlap = existingSlots.some((slot) => doSlotsOverlap(updatedSlot, slot));
			if (hasOverlap) {
				toast.error("The edited slot overlaps with an existing weekly slot.");
				return;
			}

			try {
				const response = await updateWeeklySlotAPI(user?.id as string, editSlot.slotId, updatedSlot.startTime, updatedSlot.endTime);
				if (response.success) {
					setWeeklySlots((prev) => {
						const updatedSlots = {
							...prev,
							[editSlot.day]: {
								...prev[editSlot.day],
								slots: prev[editSlot.day].slots.map((slot) => (slot.id === editSlot.slotId ? { ...slot, ...updatedSlot } : slot)),
								unavailable: !prev[editSlot.day].slots.some((slot) => (slot.id === editSlot.slotId ? true : slot.isActive)),
							},
						};
						return updatedSlots;
					});
					setEditSlot(null);
					toast.success("Slot updated successfully.");
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		} else {
			const existingDateSlots = dateSlots[editSlot.day]?.slots.filter((slot) => slot.id !== editSlot.slotId) || [];
			const hasOverlap = existingDateSlots.some((slot) => doSlotsOverlap(updatedSlot, slot));
			if (hasOverlap) {
				toast.error("The edited slot overlaps with an existing date-specific slot.");
				return;
			}

			try {
				const response = await updateDateSlotAPI(user?.id as string, editSlot.slotId, updatedSlot.startTime, updatedSlot.endTime);
				if (response.success) {
					setDateSlots((prev) => {
						const updatedSlots = {
							...prev,
							[editSlot.day]: {
								...prev[editSlot.day],
								slots: prev[editSlot.day].slots.map((slot) => (slot.id === editSlot.slotId ? { ...slot, ...updatedSlot } : slot)),
							},
						};
						// Sort the updatedSlots by date
						const sortedDateSlots: IDateAvailability = {};
						Object.keys(updatedSlots)
							.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
							.forEach((date) => {
								sortedDateSlots[date] = updatedSlots[date];
							});
						return sortedDateSlots;
					});
					setEditSlot(null);
					toast.success("Slot updated successfully.");
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setEditSlot((prev) =>
			prev
				? {
						...prev,
						[field]: value,
						...(field === "startTime" ? { endTime: calculateEndTime(value) } : {}),
				  }
				: prev
		);
	};

	return (
		<div>
			<div className="mx-auto">
				<div className="mb-4">
					<h1 className="text-2xl font-bold">Mentor Availability</h1>
					<p className="text-sm text-muted-foreground">Set your availability for mentoring sessions.</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Weekly Slots Section */}
					<Card>
						<CardHeader>
							<CardTitle>Weekly Hours</CardTitle>
							<p className="text-muted-foreground">Set recurring weekly availability</p>
						</CardHeader>
						<CardContent className="space-y-4">
							{daysOfWeek.map((day, index) => (
								<div key={index} className="flex gap-2 p-3 bg-muted rounded-md">
									<div className="flex flex-col gap-2">
										<div className="bg-primary w-8 h-8 flex items-center justify-center rounded-full">
											<Label className="text-white text-sm">{day.slice(0, 1)}</Label>
										</div>
										<Switch checked={isDayAvailable(weeklySlots[index.toString()].slots)} onCheckedChange={(checked) => handleToggleAvailability(index.toString(), checked)} className="mr-2" />
									</div>
									<div className="flex flex-col">
										<div className="space-y-2">
											{sortWeeklySlotsByStartTime(weeklySlots[index.toString()].slots).map((slot) => (
												<div key={slot.id} className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
													{editSlot?.slotId === slot.id ? (
														<form onSubmit={handleSaveEdit} className="flex items-center gap-2 w-full">
															<Input type="time" value={editSlot.startTime} onChange={(e) => handleInputChange("startTime", e.target.value)} className="w-3/4" />
															<span>to</span>
															<Input type="time" value={editSlot.endTime} readOnly className="w-3/4 bg-gray-100" />
															<div className="flex">
																<Button type="submit" variant="ghost" className="rounded-full" size="sm">
																	<Save className="h-4 w-4" />
																</Button>
																<Button type="button" variant="ghost" className="rounded-full" size="sm" onClick={() => setEditSlot(null)}>
																	<X className="h-4 w-4" />
																</Button>
															</div>
														</form>
													) : (
														<div className="flex items-center justify-between gap-2 w-full">
															<span className="text-sm">
																{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
															</span>
															<div>
																<Button variant="ghost" className="rounded-full" size="sm" onClick={() => handleEditSlot(index.toString(), slot.id, slot.startTime, slot.endTime, true)}>
																	<Edit className="h-4 w-4" />
																</Button>
																<Button variant="ghost" className="hover:bg-red-100 rounded-full" size="sm" onClick={() => handleRemoveSlot(index.toString(), slot.id, true)}>
																	<Trash2 className="h-4 w-4 text-red-600" />
																</Button>
																<Switch className="ml-2" checked={slot.isActive} onCheckedChange={(checked) => handleToggleWeeklySlotActive(index.toString(), slot.id, checked)} />
															</div>
														</div>
													)}
												</div>
											))}
										</div>
										<Button variant="outline" size="sm" onClick={() => handleAddWeeklySlotModal(index.toString())} className="mt-2">
											<Plus className="h-4 w-4 mr-2" /> Add Slot
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					{/* Date-Specific Slots Section */}
					<Card>
						<CardHeader>
							<CardTitle>Date-Specific Slots</CardTitle>
							<p className="text-muted-foreground">Set availability for specific dates</p>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button variant="outline" onClick={() => setIsDateModalOpen(true)}>
								<Plus className="h-4 w-4 mr-2" /> Add Date-Specific Slot
							</Button>
							{
								// Sort date slots by date
								Object.entries(dateSlots)
									.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
									.map(([date, { slots }]) =>
										// Sort slots within each date by start time
										sortDateSlotsByStartTime(slots || [])
											.filter((slot): slot is IDateSlot => slot != null && slot.startTime != null)
											.map((slot) => (
												// Display each slot with its date
												<div key={slot.id} className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
													{editSlot?.slotId === slot.id && !editSlot.isWeekly ? (
														<form onSubmit={handleSaveEdit} className="flex items-center justify-evenly gap-2 w-full">
															<div>{formatDate(date)}</div>
															<div className="flex items-center gap-2">
																<Input type="time" value={editSlot.startTime} onChange={(e) => handleInputChange("startTime", e.target.value)} className="w-30" />
																<span>to</span>
																<Input type="time" value={editSlot.endTime} readOnly className="w-30 bg-gray-100" />
															</div>
															<div className="flex">
																<Button type="submit" variant="ghost" className="rounded-full" size="sm">
																	<Save className="h-4 w-4" />
																</Button>
																<Button type="button" variant="ghost" className="rounded-full" size="sm" onClick={() => setEditSlot(null)}>
																	<X className="h-4 w-4" />
																</Button>
															</div>
														</form>
													) : (
														<div className="flex items-center justify-evenly gap-2 w-full">
															<div>{formatDate(date)}</div>
															<div className="flex items-center gap-2">
																<span className="text-sm">
																	{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
																</span>
															</div>
															<div>
																<Button variant="ghost" className="rounded-full" size="sm" onClick={() => handleEditSlot(date, slot.id, slot.startTime, slot.endTime, false)}>
																	<Edit className="h-4 w-4" />
																</Button>
																<Button variant="ghost" className="hover:bg-red-100 rounded-full" size="sm" onClick={() => handleRemoveSlot(date, slot.id, false)}>
																	<Trash2 className="h-4 w-4 text-red-600" />
																</Button>
															</div>
														</div>
													)}
												</div>
											))
									)
							}
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Modal for Adding Weekly Slot */}
			<Dialog open={isWeeklyModalOpen} onOpenChange={setIsWeeklyModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Weekly Slot</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSaveWeeklySlot} className="space-y-4">
						<div className="space-y-2">
							<Label>Day</Label>
							<Input type="text" value={days[parseInt(newWeeklySlot.day)]} readOnly className="bg-gray-100" />
						</div>
						<div className="space-y-2">
							<Label>Start Time</Label>
							<Input type="time" value={newWeeklySlot.startTime} onChange={(e) => handleWeeklyStartTimeChange(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label>End Time</Label>
							<Input type="time" value={newWeeklySlot.endTime} readOnly className="bg-gray-100" />
						</div>
						<p className="text-sm text-muted-foreground">All slots are 1 hour long. To create a 2-hour slot, add two consecutive slots (e.g., 09:00–10:00 and 10:00–11:00).</p>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setIsWeeklyModalOpen(false)}>
								Cancel
							</Button>
							<Button type="submit">Add Slot</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Modal for Adding Date-Specific Slot */}
			<Dialog open={isDateModalOpen} onOpenChange={setIsDateModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Date-Specific Slot</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAddDateSlot} className="space-y-4">
						<div className="space-y-2">
							<Label>Date</Label>
							<Input type="date" value={newDateSlot.date} onChange={(e) => setNewDateSlot({ ...newDateSlot, date: e.target.value })} required min={new Date().toISOString().split("T")[0]} />
						</div>
						<div className="space-y-2">
							<Label>Start Time</Label>
							<Input type="time" value={newDateSlot.startTime} onChange={(e) => handleDateStartTimeChange(e.target.value)} required />
						</div>
						<div className="space-y-2">
							<Label>End Time</Label>
							<Input type="time" value={newDateSlot.endTime} readOnly className="bg-gray-100" />
						</div>
						<p className="text-sm text-muted-foreground">All slots are 1 hour long. To create a 2-hour slot, add two consecutive slots (e.g., 09:00–10:00 and 10:00–11:00).</p>
						<DialogFooter>
							<Button type="button" variant="outline" onClick={() => setIsDateModalOpen(false)}>
								Cancel
							</Button>
							<Button type="submit">Add Slot</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
