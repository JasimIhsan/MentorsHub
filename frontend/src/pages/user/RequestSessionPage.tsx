import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Video, Users, ArrowRight, CalendarDays, Clock } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMentor } from "@/hooks/useMentor";
import { IMentorDTO } from "@/interfaces/mentor.application.dto";
import { format } from "date-fns";
import logo from "@/assets/MentorsHub logo image.jpg";

declare global {
	interface Window {
		Razorpay: any;
	}
}

export function RequestSessionPage() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [time, setTime] = useState<string>("");
	const [sessionType, setSessionType] = useState<string>("video");
	const [sessionFormat, setSessionFormat] = useState<string>("one-on-one");
	const [message, setMessage] = useState<string>("");
	const [hours, setHours] = useState<number>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
	const { mentorId } = useParams<{ mentorId: string }>();
	const { mentor, loading } = useMentor(mentorId as string) as { mentor: IMentorDTO | null; loading: boolean };
	const navigate = useNavigate();

	if (loading) {
		return <div className="container py-8">Loading...</div>;
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

	const requestData = { sessionType, sessionFormat, date, time, message, hours };

	const isFormValid = () => {
		return date && time && sessionType && sessionFormat && message.trim() && hours > 0;
	};

	const calculateTotal = () => {
		const platformFee = 40;
		const sessionFee = mentor.hourlyRate ? Number(mentor.hourlyRate) * hours : 0;
		return sessionFee + platformFee;
	};

	const handleFreeSessionConfirm = async () => {
		setIsSubmitting(true);
		setIsConfirmationOpen(false);
		try {
			console.log("Free session request:", requestData);
			// Simulate API call or navigation
			navigate("/confirmation", { state: { requestData } });
		} catch (error) {
			alert("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePaidSession = async () => {
		setIsSubmitting(true);
		try {
			// Load Razorpay script dynamically
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			document.body.appendChild(script);

			script.onload = () => {
				const totalAmount = calculateTotal() * 100;
				const options = {
					key: import.meta.env.VITE_RAZORPAY_KEY,
					amount: totalAmount,
					currency: "INR",
					image: logo,
					name: "Mentor Session Booking",
					description: `Session with ${mentor.firstName} ${mentor.lastName}`,
					handler: function (response: any) {
						console.log("Payment successful:", response);
						navigate("/confirmation", {
							state: { requestData, paymentId: response.razorpay_payment_id },
						});
					},
					prefill: {
						name: `${mentor.firstName} ${mentor.lastName}`,
						email: `${mentor.email}`,
					},
					theme: {
						color: "#112d4e",
					},
					notes: {
						sessionType,
						sessionFormat,
						hours,
					},
					modal: {
						ondismiss: () => {
							setIsSubmitting(false);
						},
					},
				};

				const rzp = new window.Razorpay(options);
				rzp.open();
			};

			script.onerror = () => {
				alert("Failed to load Razorpay SDK. Please try again.");
				setIsSubmitting(false);
			};
		} catch (error) {
			alert("An error occurred. Please try again.");
			setIsSubmitting(false);
		}
	};

	const handleSubmit = async (pricing: "free" | "paid" | "both-pricing") => {
		if (pricing === "free") {
			setIsConfirmationOpen(true);
		} else {
			await handlePaidSession();
		}
	};

	return (
		<div className="container py-8">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Request a Session</h1>
					<p className="text-muted-foreground">
						Schedule a mentoring session with {mentor.firstName} {mentor.lastName}. Provide your preferred details below, and refer to the mentor's preferences on the right.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px]">
					{/* Main Content */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Session Request</CardTitle>
								<CardDescription>Propose your preferred session details</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div>
									<Label className="mb-2 block">Session Type</Label>
									<RadioGroup value={sessionType} onValueChange={setSessionType} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
										<div className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${sessionType === "video" ? "border-primary bg-primary/5" : ""}`}>
											<RadioGroupItem value="video" id="video" />
											<Label htmlFor="video" className="flex cursor-pointer items-center gap-2 font-normal">
												<Video className="h-5 w-5" />
												Video Call
											</Label>
										</div>
										<div className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${sessionType === "chat" ? "border-primary bg-primary/5" : ""}`}>
											<RadioGroupItem value="chat" id="chat" />
											<Label htmlFor="chat" className="flex cursor-pointer items-center gap-2 font-normal">
												<MessageSquare className="h-5 w-5" />
												Chat
											</Label>
										</div>
									</RadioGroup>
								</div>

								<div>
									<Label className="mb-2 block">Session Format</Label>
									<RadioGroup value={sessionFormat} onValueChange={setSessionFormat} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										<div className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${sessionFormat === "one-on-one" ? "border-primary bg-primary/5" : ""}`}>
											<RadioGroupItem value="one-on-one" id="one-on-one" />
											<Label htmlFor="one-on-one" className="flex cursor-pointer items-center gap-2 font-normal">
												<Users className="h-5 w-5" />
												One-on-One
											</Label>
										</div>
										<div className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${sessionFormat === "group" ? "border-primary bg-primary/5" : ""}`}>
											<RadioGroupItem value="group" id="group" />
											<Label htmlFor="group" className="flex cursor-pointer items-center gap-2 font-normal">
												<Users className="h-5 w-5" />
												Group Session
											</Label>
										</div>
									</RadioGroup>
								</div>

								<div>
									<Label htmlFor="date" className="mb-2 block">
										Preferred Date
									</Label>
									<div>
										<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" disabled={(date) => date < new Date()} />
									</div>
								</div>

								<div>
									<Label htmlFor="time" className="mb-2 block">
										Preferred Time
									</Label>
									<Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full" placeholder="Select a time" aria-label="Preferred time" />
								</div>

								<div>
									<Label htmlFor="hours" className="mb-2 block">
										Duration (Hours)
									</Label>
									<Select value={hours.toString()} onValueChange={(value) => setHours(Number(value))}>
										<SelectTrigger id="hours" className="w-full">
											<SelectValue placeholder="Select hours" />
										</SelectTrigger>
										<SelectContent>
											{[1, 2, 3, 4, 5].map((hour) => (
												<SelectItem key={hour} value={hour.toString()}>
													{hour} {hour === 1 ? "hour" : "hours"}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button onClick={() => handleSubmit(mentor.pricing)} className="gap-2" disabled={!isFormValid() || isSubmitting}>
									{isSubmitting ? "Submitting..." : mentor.pricing === "free" ? "Submit Request" : "Proceed to Payment"}
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
											<span className="text-sm">Preferred Session Type</span>
											<div className="flex items-center gap-1">
												{mentor.sessionTypes.includes("video") ? <Video className="h-4 w-4 text-muted-foreground" /> : mentor.sessionTypes.includes("chat") ? <MessageSquare className="h-4 w-4 text-muted-foreground" /> : null}
												<span className="text-sm">{mentor.sessionTypes.join(", ")}</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Preferred Format</span>
											<div className="flex items-center gap-1">
												<Users className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{mentor.sessionFormat === "one-on-one" ? "One-on-One" : mentor.sessionFormat === "group" ? "Group" : "Both "}</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Availability</span>
											<span className="text-sm">{mentor.availability.join(", ")}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Rate</span>
											<span className="text-sm font-medium">{mentor.pricing === "free" ? "Free" : mentor.hourlyRate ? `₹${mentor.hourlyRate}/hr` : "N/A"}</span>
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
								</CardHeader>
								<CardContent className="pb-2">
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<CalendarDays className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{requestData.date ? format(requestData.date, "EEEE, MMMM d, yyyy") : "Not selected"}</span>
										</div>
										<div className="flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{requestData.time || "Not selected"}</span>
										</div>
										<div className="flex items-center gap-2">
											<MessageSquare className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{requestData.sessionType === "video" ? "Video Call" : "Chat"}</span>
										</div>
										<div className="flex items-center gap-2">
											<MessageSquare className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">{requestData.sessionFormat === "one-on-one" ? "One-on-One" : "Group Session"}</span>
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
											<span className="text-sm">₹{mentor.hourlyRate ? Number(mentor.hourlyRate) * hours : "N/A"}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-sm">Platform Fee</span>
											<span className="text-sm">₹40.00</span>
										</div>
										<Separator className="my-2" />
										<div className="flex justify-between font-bold">
											<span>Total</span>
											<span>₹{mentor.hourlyRate ? calculateTotal() : "N/A"}</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				{/* Confirmation Modal for Free Sessions */}
				<Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Confirm Session Request</DialogTitle>
							<DialogDescription>
								You're about to request a free {sessionType} session with {mentor.firstName} {mentor.lastName} for {hours} {hours === 1 ? "hour" : "hours"} on {date ? format(date, "MMMM d, yyyy") : "selected date"} at{" "}
								{time || "selected time"}. Please confirm to proceed.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleFreeSessionConfirm} disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Confirm Request"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
