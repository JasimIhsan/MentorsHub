import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatDate, formatTime } from "@/utility/time-data-formatter";
import { Edit, Plus, Save, Trash, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import axiosInstance from "@/api/config/api.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addWeeklySlotAPI, deleteWeeklySlotAPI, toggleWeeklySlotActiveAPI, updateWeeklySlotAPI } from "@/api/mentor.availability.api.service";
import { toast } from "sonner";

// Interfaces
interface Slot {
	id: string;
	startTime: string;
	endTime: string;
	isActive: boolean;
}

interface DayAvailability {
	unavailable: boolean;
	slots: Slot[];
}

interface DateSlots {
	[date: string]: { slots: Slot[] };
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
const initializeWeeklySlots = (): Record<string, DayAvailability> => ({
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

const doSlotsOverlap = (newSlot: { startTime: string; endTime: string }, existingSlot: Slot): boolean => {
	const newStart = new Date(`2000-01-01T${newSlot.startTime}:00`);
	const newEnd = new Date(`2000-01-01T${newSlot.endTime}:00`);
	const existingStart = new Date(`2000-01-01T${existingSlot.startTime}:00`);
	const existingEnd = new Date(`2000-01-01T${existingSlot.endTime}:00`);

	return newStart < existingEnd && newEnd > existingStart;
};

// Sort slots by startTime
const sortSlotsByStartTime = (slots: Slot[]): Slot[] => {
	return [...slots].sort((a, b) => {
		const [aHours, aMinutes] = a.startTime.split(":").map(Number);
		const [bHours, bMinutes] = b.startTime.split(":").map(Number);
		const aTotalMinutes = aHours * 60 + aMinutes;
		const bTotalMinutes = bHours * 60 + bMinutes;
		return aTotalMinutes - bTotalMinutes;
	});
};

export function MentorAvailabilityPage() {
	const [weeklySlots, setWeeklySlots] = useState<Record<string, DayAvailability>>(initializeWeeklySlots());
	const [dateSlots, setDateSlots] = useState<DateSlots>({});
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
			const response = await axiosInstance.get(`/mentor/availability/weekly/${user.id}`);
			if (response.data.success) {
				const newSlots = initializeWeeklySlots();
				response.data.slots.forEach((slot: IWeeklyAvailability) => {
					const day = slot.dayOfWeek.toString();
					newSlots[day] = {
						unavailable: false,
						slots: [
							...(newSlots[day]?.slots || []),
							{
								id: slot.id,
								startTime: slot.startTime,
								endTime: slot.endTime,
								isActive: slot.isActive,
							},
						],
					};
				});
				setWeeklySlots(newSlots);
			}
		} catch (error) {
			console.error("Error fetching weekly slots:", error);
		}
	}, [user?.id]);

	useEffect(() => {
		fetchWeeklySlots();
	}, [fetchWeeklySlots]);

	// Handlers
	const handleToggleAvailability = (day: string) => {
		setWeeklySlots((prev) => ({
			...prev,
			[day]: { ...prev[day], unavailable: !prev[day].unavailable },
		}));
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

		const slot = {
			day: newWeeklySlot.day,
			startTime: newWeeklySlot.startTime,
			endTime: newWeeklySlot.endTime,
		};

		// Check for overlaps
		const existingSlots = weeklySlots[newWeeklySlot.day].slots;
		const hasOverlap = existingSlots.some((existingSlot) => doSlotsOverlap(slot, existingSlot));

		if (hasOverlap) {
			toast.error("The new slot overlaps with an existing slot.");
			return;
		}

		try {
			const response = await addWeeklySlotAPI(user.id, slot);
			if (response.success) {
				setWeeklySlots((prev) => ({
					...prev,
					[newWeeklySlot.day]: {
						unavailable: false,
						slots: [...prev[newWeeklySlot.day].slots, response.slot],
					},
				}));
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
			// Update the slot's isActive field in the API
			const response = await toggleWeeklySlotActiveAPI(user?.id as string, slotId);
			if (response.success) {
				// Update local state
				setWeeklySlots((prev) => ({
					...prev,
					[day]: {
						...prev[day],
						slots: prev[day].slots.map((slot) => (slot.id === slotId ? { ...slot, isActive } : slot)),
					},
				}));
				toast.success(`Slot ${isActive ? "activated" : "deactivated"} successfully.`);
			}
		} catch (error) {
			console.error("Error toggling weekly slot active status:", error);
			if (error instanceof Error) toast.error(error.message);
		}
	};

	const handleAddDateSlot = async (e: React.FormEvent) => {
		e.preventDefault();
		const slot = {
			day: newDateSlot.date,
			startTime: newDateSlot.startTime,
			endTime: newDateSlot.endTime,
			isActive: true,
		};

		try {
			const response = await saveDateSlotToDatabase(slot);
			if (response.success) {
				setDateSlots((prev) => ({
					...prev,
					[newDateSlot.date]: {
						slots: [
							...(prev[newDateSlot.date]?.slots || []),
							{
								id: response.id,
								startTime: response.startTime,
								endTime: response.endTime,
								isActive: response.isActive,
							},
						],
					},
				}));
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
		try {
			if (isWeekly) {
				const response = await deleteWeeklySlotAPI(user?.id as string, slotId);
				if (response.success) {
					setWeeklySlots((prev) => ({
						...prev,
						[key]: {
							...prev[key],
							slots: prev[key].slots.filter((slot) => slot.id !== slotId),
						},
					}));
					toast.success("Slot removed successfully.");
				}
			} else {
				setDateSlots((prev) => ({
					...prev,
					[key]: {
						...prev[key],
						slots: prev[key].slots.filter((slot) => slot.id !== slotId),
					},
				}));
			}
		} catch (error) {
			console.error("Error removing slot:", error);
			if (error instanceof Error) toast.error(error.message);
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

		if (editSlot.isWeekly) {
			try {
				const response = await updateWeeklySlotAPI(user?.id as string, editSlot.slotId, updatedSlot.startTime, updatedSlot.endTime);
				if (response.success) {
					setWeeklySlots((prev) => ({
						...prev,
						[editSlot.day]: {
							...prev[editSlot.day],
							slots: prev[editSlot.day].slots.map((slot) => (slot.id === editSlot.slotId ? { ...slot, ...updatedSlot } : slot)),
						},
					}));
					setEditSlot(null);
					toast.success("Slot updated successfully.");
				}
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			}
		} else {
			setDateSlots((prev) => ({
				...prev,
				[editSlot.day]: {
					...prev[editSlot.day],
					slots: prev[editSlot.day].slots.map((slot) => (slot.id === editSlot.slotId ? { ...slot, ...updatedSlot } : slot)),
				},
			}));
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

	const saveDateSlotToDatabase = async (slot: { day: string; startTime: string; endTime: string; isActive: boolean }) => {
		console.log("Saving date-specific slot to database:", slot);
		return {
			success: true,
			id: `slot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			startTime: slot.startTime,
			endTime: slot.endTime,
			isActive: slot.isActive,
		};
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
										<Switch checked={!weeklySlots[index.toString()].unavailable} onCheckedChange={() => handleToggleAvailability(index.toString())} className="mr-2" />
									</div>
									<div className="flex flex-col">
										{weeklySlots[index.toString()].unavailable ? (
											<span className="text-sm text-muted-foreground">Unavailable</span>
										) : (
											<div className="space-y-2">
												{sortSlotsByStartTime(weeklySlots[index.toString()].slots).map((slot) => (
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
																	<Switch className="ml-2" checked={slot.isActive} onCheckedChange={(checked) => handleToggleWeeklySlotActive(index.toString(), slot.id, checked)} />{" "}
																</div>
															</div>
														)}
													</div>
												))}
											</div>
										)}
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
						<CardContent className="space-y-4">
							<Button variant="outline" onClick={() => setIsDateModalOpen(true)}>
								<Plus className="h-4 w-4 mr-2" /> Add Date-Specific Slot
							</Button>
							{Object.entries(dateSlots)
								.sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
								.map(([date, { slots }]) => (
									<div key={date} className="p-3 bg-muted rounded-md">
										<div className="flex justify-between items-center mb-2">
											<span className="font-medium">{formatDate(date)}</span>
										</div>
										<div className="space-y-2">
											{sortSlotsByStartTime(slots || [])
												.filter((slot): slot is Slot => slot != null && slot.startTime != null)
												.map((slot) => (
													<div key={slot.id} className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
														{editSlot?.slotId === slot.id && !editSlot.isWeekly ? (
															<form onSubmit={handleSaveEdit} className="flex items-center gap-2 w-full">
																<Input type="time" value={editSlot.startTime} onChange={(e) => handleInputChange("startTime", e.target.value)} className="w-24" />
																<span>to</span>
																<Input type="time" value={editSlot.endTime} readOnly className="w-24 bg-gray-100" />
																<Button type="submit" variant="outline" size="sm">
																	Save
																</Button>
																<Button type="button" variant="ghost" size="sm" onClick={() => setEditSlot(null)}>
																	<Trash className="h-4 w-4" />
																</Button>
															</form>
														) : (
															<>
																<span className="text-sm">
																	{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
																</span>
																<Button variant="ghost" className="rounded-full" size="sm" onClick={() => handleEditSlot(date, slot.id, slot.startTime, slot.endTime, false)}>
																	<Edit className="h-4 w-4" />
																</Button>
																<Button variant="ghost" className="hover:bg-red-100 rounded-full" size="sm" onClick={() => handleRemoveSlot(date, slot.id, false)}>
																	<Trash2 className="h-4 w-4 text-red-600" />
																</Button>
																<Switch
																	checked={slot.isActive}
																	onCheckedChange={(checked) =>
																		setDateSlots((prev) => ({
																			...prev,
																			[date]: {
																				...prev[date],
																				slots: prev[date].slots.map((s) => (s.id === slot.id ? { ...s, isActive: checked } : s)),
																			},
																		}))
																	}
																/>
															</>
														)}
													</div>
												))}
										</div>
									</div>
								))}
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
						<div>
							<Label>Date</Label>
							<Input type="date" value={newDateSlot.date} onChange={(e) => setNewDateSlot({ ...newDateSlot, date: e.target.value })} required min={new Date().toISOString().split("T")[0]} />
						</div>
						<div>
							<Label>Start Time</Label>
							<Input type="time" value={newDateSlot.startTime} onChange={(e) => handleDateStartTimeChange(e.target.value)} required />
						</div>
						<div>
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
