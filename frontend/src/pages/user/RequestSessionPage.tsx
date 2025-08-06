import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMentor } from "@/hooks/useMentor";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { format } from "date-fns";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Loading } from "@/components/custom/Loading";
import { fetchMentorAvailabilityAPI } from "@/api/mentors.api.service";
import { CustomCalendar } from "@/components/custom/CustomCalendar";
import { formatTime } from "@/utility/time-data-formatter";
import { motion } from "framer-motion";

export interface SessionData {
	mentorId: string;
	userId: string;
	topic: string;
	date: Date;
	startTime: string;
	endTime: string;
	hours: number;
	message: string;
	totalAmount: number;
	pricing: "free" | "paid" | "both-pricing";
}

export function RequestSessionPage() {
	const [date, setDate] = useState<Date | null>(new Date());
	const [time, setTime] = useState<string>("");
	const [topic, setTopic] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [hours, setHours] = useState<number>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const [availability, setAvailability] = useState<string[]>([]);
	const [isSlotValid, setIsSlotValid] = useState<boolean>(true);
	const { mentorId } = useParams<{ mentorId: string }>();
	const { mentor, loading } = useMentor(mentorId as string) as { mentor: IMentorDTO | null; loading: boolean };
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.userAuth.user);

	useEffect(() => {
		const fetchAvailability = async () => {
			if (!date || !mentorId || !hours) {
				toast.error("Please select a date and time.");
				return;
			}
			console.log(`date in page : `, date);
			// const localDateString = getLocalDateString(date);

			try {
				const response = await fetchMentorAvailabilityAPI(mentorId as string, date, hours);
				if (response.success && response.isExist) {
					setAvailability(response.availability);
					setTime("");
					setIsSlotValid(true);
				} else {
					setAvailability([]);
					setTime("");
					setIsSlotValid(false);
					toast.error("Mentor is not available on this date.");
				}
			} catch (error) {
				console.error("Error fetching availability:", error);
				toast.error("Failed to fetch mentor availability. Please try again.");
				setAvailability([]);
			}
		};
		fetchAvailability();
	}, [date, mentorId, hours]);

	if (loading) {
		return <Loading appName="Request Session" loadingMessage="Loading Mentor Preferences" />;
	}

	if (!mentor || !mentorId) {
		return (
			<div className="container py-8">
				<p className="text-red-500">Error: Mentor not found. Please try again.</p>
				<Button asChild>
					<Link to="/mentors">Back to Mentors</Link>
				</Button>
			</div>
		);
	}

	const isFormValid = () => {
		return date && time && topic && message.trim() && hours > 0 && isSlotValid;
	};

	const calculateTotal = () => {
		const platformFee = 40;
		const sessionFee = mentor.pricing === "paid" && mentor.hourlyRate ? mentor.hourlyRate * hours : 0;
		return sessionFee + platformFee;
	};

	// const validateSlot = (selectedTime: string, selectedHours: number) => {
	// 	if (!selectedTime || !date) return false;
	// 	const selectedDateTime = parse(selectedTime, "HH:mm", date);
	// 	const selectedEndTime = new Date(selectedDateTime.getTime() + selectedHours * 60 * 60 * 1000);

	// 	const isValid = availability.some((slot) => {
	// 		const slotStart = parse(slot.startTime, "HH:mm", date);
	// 		const slotEnd = new Date(slotStart.getTime() + slot.duration * 60 * 60 * 1000);
	// 		return selectedDateTime >= slotStart && selectedEndTime <= slotEnd;
	// 	});

	// 	setIsSlotValid(isValid);
	// 	return isValid;
	// };

	const handleTimeChange = (value: string) => {
		setTime(value);
		if (value) {
			// validateSlot(value, hours);
		} else {
			setIsSlotValid(true);
		}
	};

	const handleHoursChange = (value: string) => {
		const newHours = Number(value);
		setHours(newHours);
		if (time) {
			// validateSlot(time, newHours);
		}
	};

	const calculateEndTime = (startTime: string): string => {
		const [hour, minute] = startTime.split(":").map(Number);

		const startDate = new Date();
		startDate.setHours(hour);
		startDate.setMinutes(minute);
		startDate.setSeconds(0);

		startDate.setHours(startDate.getHours() + hours);

		const endHour = String(startDate.getHours()).padStart(2, "0");
		const endMinute = String(startDate.getMinutes()).padStart(2, "0");
		const endTime = `${endHour}:${endMinute}`;

		return endTime;
	};

	const requestData: SessionData = {
		mentorId: mentorId,
		userId: user?.id as string,
		topic: topic,
		date: (date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) : date) as Date,
		startTime: time,
		endTime: calculateEndTime(time),
		hours: hours,
		message: message,
		totalAmount: calculateTotal(),
		pricing: mentor.pricing,
	};

	const handleSubmit = () => {
		if (!isFormValid()) {
			toast.error("Please fill out all required fields correctly and select a valid time slot.");
			return;
		}
		setIsConfirmationOpen(true);
	};

	const handleConfirmRequest = async () => {
		setIsSubmitting(true);
		setIsConfirmationOpen(false);
		try {
			const response = await axiosInstance.post("/user/sessions/create-session", requestData);
			if (response.data.success) {
				toast.success(response.data.message || "Session request submitted successfully! Awaiting mentor approval.");
				navigate("/request-confirmation", { state: { requestData } });
			}
		} catch (error: any) {
			console.error("Session creation error:", error);
			const errorMessage = error.response?.data?.message || "An error occurred while submitting the request. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center w-full py-8 px-10 md:px-20 xl:px-25">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Request a Session</h1>
					<p className="text-muted-foreground">
						Schedule a mentoring session with {mentor.firstName} {mentor.lastName}. Select an available time slot below, and refer to the mentor's preferences on the right. Payment will be processed after the mentor accepts your request.
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_380px]">
					{/* Main Content */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Session Request</CardTitle>
								<CardDescription>Propose your preferred session details</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<Label htmlFor="topic" className="mb-2 block">
										Session Topic
									</Label>
									<Input id="topic" type="text" value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full" placeholder="Enter your topic" aria-label="Session topic" />
								</div>

								<div>
									<Label htmlFor="message" className="mb-2 block">
										Message to Mentor
									</Label>
									<Textarea
										id="message"
										aria-label="Message to mentor"
										placeholder="Describe what you'd like to learn or discuss during this session..."
										className="min-h-[150px]"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
									/>
								</div>

								<div>
									<Label htmlFor="hours" className="mb-2 block">
										Duration (Hours)
									</Label>
									<Select value={hours.toString()} onValueChange={handleHoursChange}>
										<SelectTrigger id="hours" className="w-full">
											<SelectValue placeholder="Select hours" />
										</SelectTrigger>
										<SelectContent>
											{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) => (
												<SelectItem key={hour} value={hour.toString()}>
													{hour} {hour === 1 ? "hour" : "hours"}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="date" className="mb-2 block">
										Preferred Date
									</Label>
									<CustomCalendar selectedDate={date} setSelectedDate={setDate} />
								</div>

								<div>
									<Label htmlFor="time" className="mb-2 block">
										Available Time Slots
									</Label>
									<div className="p-4 bg-white rounded-md border">
										{availability.length > 0 ? (
											<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
												{availability.map((slot) => (
													<motion.div key={slot} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
														<Button variant={time === slot ? "default" : "outline"} size="sm" className={`w-full py-8 relative ${time === slot ? "ring-2 ring-blue-500 ring-offset-1" : ""}`} onClick={() => handleTimeChange(slot)}>
															{`${formatTime(slot)} - ${formatTime(calculateEndTime(slot))}`}
														</Button>
													</motion.div>
												))}
											</div>
										) : (
											<p className="text-gray-500 text-sm">No slots available in this period</p>
										)}
									</div>
									{/* <Select value={time} onValueChange={handleTimeChange}>
										<SelectTrigger id="time" className="w-full">
											<SelectValue placeholder={availability.length ? "Select a time slot" : "No slots available"} />
										</SelectTrigger>
										<SelectContent>
											{availability.length ? (
												availability.map((slot, index) => {
													const dateTime = new Date(`2025-05-05T${slot}:00`); // Use a fixed date or dynamically generate
													return (
														<SelectItem key={index} value={slot}>
															{format(dateTime, "h:mm a")} 
														</SelectItem>
													);
												})
											) : (
												<SelectItem value="none" disabled>
													No slots available
												</SelectItem>
											)}
										</SelectContent>
									</Select> */}
									{!isSlotValid && time && <p className="mt-2 text-sm text-red-500">The selected time and duration are not available. Please choose another slot or adjust the duration.</p>}
								</div>
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button onClick={handleSubmit} className="gap-2" disabled={!isFormValid() || isSubmitting}>
									{isSubmitting ? "Submitting..." : "Submit Request"}
									<ArrowRight className="h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>
					</div>

					{/* Sidebar */}
					<div className="flex flex-col gap-4">
						<div>
							<Card>
								<CardHeader className="pb-3">
									<CardTitle>Mentor Preferences</CardTitle>
									<CardDescription>Reference these when requesting a session</CardDescription>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="flex items-start gap-4">
										<Avatar className="h-12 w-12 border-2 border-primary/20">
											<AvatarImage src={mentor.avatar ?? undefined} alt={`${mentor.firstName} ${mentor.lastName}`} />
											<AvatarFallback>{mentor.firstName.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<h3 className="font-bold">
												{mentor.firstName} {mentor.lastName}
											</h3>
											<p className="text-sm text-muted-foreground">{mentor.professionalTitle}</p>
										</div>
									</div>
									<Separator className="my-4" />
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm">Preferred Format</span>
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{mentor.sessionFormat === "one-on-one" ? "One-on-One" : mentor.sessionFormat === "group" ? "Group" : "One-on-One, Group"}</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Rate</span>
											<span className="text-sm font-medium">{mentor.pricing === "free" ? "Free" : mentor.hourlyRate ? `₹${mentor.hourlyRate}/hour` : "N/A"}</span>
										</div>
									</div>
									<Separator className="my-4" />
									<Button variant="outline" size="sm" className="w-full" onClick={() => navigate(-1)}>
										View Full Profile
									</Button>
								</CardContent>
							</Card>
						</div>

						<div>
							<Card>
								<CardHeader className="pb-3">
									<CardTitle>Order Summary</CardTitle>
									<CardDescription>Pay after mentor approval</CardDescription>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<CalendarDays className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{requestData.date ? format(requestData.date, "EEEE, MMMM d, yyyy") : "Not selected"}</span>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{requestData.startTime && requestData.endTime ? `${formatTime(requestData.startTime)} - ${formatTime(requestData.endTime)}` : "Not selected"}</span>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">
												{hours} {hours === 1 ? "hour" : "hours"}
											</span>
										</div>
									</div>
									<Separator className="my-4" />
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-sm">
												Session Fee ({hours} {hours === 1 ? "hour" : "hours"})
											</span>
											<span className="text-sm">{mentor.pricing === "free" ? "₹0" : mentor.hourlyRate ? `₹${(Number(mentor.hourlyRate) * hours).toFixed(2)}` : "N/A"}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm">Platform Fee</span>
											<span className="text-sm">₹40.00</span>
										</div>
										<Separator className="my-2" />
										<div className="flex justify-between font-bold">
											<span>Total (after approval)</span>
											<span>₹{calculateTotal().toFixed(2)}</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Confirmation Modal */}
				<Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Session Request</DialogTitle>
							<DialogDescription>
								You're about to request a session with {mentor.firstName} {mentor.lastName} for {hours} {hours === 1 ? "hour" : "hours"} on {date ? format(date, "MMMM d, yyyy") : "selected date"} at {time || "selected time"}.
								{mentor.pricing === "free"
									? "A platform fee of ₹40 will be charged upon mentor approval."
									: `A session fee of ₹${mentor.hourlyRate ? Number(mentor.hourlyRate) * hours : 0} plus a ₹40 platform fee will be charged upon mentor approval.`}
								Please confirm to proceed.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsConfirmationOpen(false)} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button onClick={handleConfirmRequest} disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Confirm Request"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
