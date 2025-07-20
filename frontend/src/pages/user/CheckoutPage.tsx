"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, MessageSquare, ArrowRight, Lock } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMentor } from "@/hooks/useMentor"; // Assuming you have this hook
import { format } from "date-fns"; // For formatting dates
import { toast } from "sonner";

interface RequestData {
	sessionFormat: string;
	date: Date | undefined;
	time: string;
	message: string;
}

export function CheckoutPage() {
	const [cardNumber, setCardNumber] = useState("");
	const [cardName, setCardName] = useState("");
	const [expiryDate, setExpiryDate] = useState("");
	const [cvv, setCvv] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { mentorId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	// Access requestData and pricing from location.state
	const { requestData } = (location.state || {}) as { requestData?: RequestData };
	const { mentor, loading, error } = useMentor(mentorId as string);

	if (error) {
		toast.error(error);
		return;
	}

	// Validate payment inputs
	const isPaymentValid = () => {
		return cardNumber.length >= 16 && cardName.trim() && expiryDate.match(/^\d{2}\/\d{2}$/) && cvv.match(/^\d{3,4}$/);
	};

	// Handle form submission
	const handlePayment = async () => {
		setIsSubmitting(true);
		try {
			// Simulate payment processing (replace with actual API call)
			await new Promise((resolve) => setTimeout(resolve, 1000));
			navigate("/checkout/confirmation", { state: { requestData, mentor } });
		} catch (error) {
			toast.error("Payment failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle loading and error states
	if (loading) {
		return <div className="container py-8">Loading...</div>;
	}

	if (!mentor || !requestData) {
		return (
			<div className="container py-8">
				<p className="text-red-500">Error: Missing mentor or session data. Please try again.</p>
				<Button asChild>
					<Link to="/mentors">Back to Mentors</Link>
				</Button>
			</div>
		);
	}

	// Calculate total
	const sessionFee = mentor.hourlyRate || 60; // Fallback to 60 if hourlyRate is undefined
	const platformFee = 5;
	const total = sessionFee + platformFee;

	return (
		<div className="container py-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
					<p className="text-muted-foreground">Complete your booking with {`${mentor.firstName} ${mentor.lastName}`}</p>
				</div>

				<div className="grid gap-8 md:grid-cols-[1fr_300px]">
					{/* Main Content */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Payment Information</CardTitle>
								<CardDescription>Enter your payment details to complete the booking</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="rounded-lg border p-4 bg-primary/5 flex items-center gap-3">
									<Lock className="h-5 w-5 text-primary" />
									<p className="text-sm">Your payment information is secure and encrypted</p>
								</div>

								<div className="space-y-4">
									<div>
										<Label htmlFor="card-number">Card Number</Label>
										<Input id="card-number" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))} aria-label="Card number" />
									</div>

									<div>
										<Label htmlFor="card-name">Name on Card</Label>
										<Input id="card-name" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} aria-label="Name on card" />
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="expiry">Expiry Date</Label>
											<Input id="expiry" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} aria-label="Expiry date" />
										</div>
										<div>
											<Label htmlFor="cvv">CVV</Label>
											<Input id="cvv" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} aria-label="CVV" />
										</div>
									</div>
								</div>

								<div>
									<Label htmlFor="country">Country</Label>
									<Select>
										<SelectTrigger aria-label="Select your country">
											<SelectValue placeholder="Select your country" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="us">United States</SelectItem>
											<SelectItem value="ca">Canada</SelectItem>
											<SelectItem value="uk">United Kingdom</SelectItem>
											<SelectItem value="au">Australia</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label htmlFor="billing-address">Billing Address</Label>
									<Input id="billing-address" placeholder="123 Main St" aria-label="Billing address" />
								</div>

								<div className="grid grid-cols-3 gap-4">
									<div className="col-span-2">
										<Label htmlFor="city">City</Label>
										<Input id="city" placeholder="New York" aria-label="City" />
									</div>
									<div>
										<Label htmlFor="zip">ZIP Code</Label>
										<Input id="zip" placeholder="10001" aria-label="ZIP code" />
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex justify-end">
								<Button onClick={handlePayment} className="gap-2" disabled={!isPaymentValid() || isSubmitting}>
									{isSubmitting ? "Processing..." : "Complete Payment"}
									<ArrowRight className="h-4 w-4" />
								</Button>
							</CardFooter>
						</Card>
					</div>

					{/* Sidebar */}
					<div>
						<Card>
							<CardHeader className="pb-3">
								<CardTitle>Order Summary</CardTitle>
							</CardHeader>
							<CardContent className="pb-2">
								<div className="flex items-start gap-4">
									<Avatar className="h-12 w-12 border-2 border-primary/20">
										<AvatarImage src={mentor.avatar || ""} alt={mentor.firstName} />
										<AvatarFallback>{mentor.firstName.charAt(0)}</AvatarFallback>
									</Avatar>
									<div>
										<h3 className="font-bold">{`${mentor.firstName} ${mentor.lastName}`}</h3>
										<p className="text-sm text-muted-foreground">{mentor.professionalTitle}</p>
									</div>
								</div>
								<Separator className="my-4" />
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
										<span className="text-sm">{requestData.sessionFormat === "one-on-one" ? "One-on-One" : "Group Session"}</span>
									</div>
								</div>
								<Separator className="my-4" />
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-sm">Session Fee</span>
										<span className="text-sm">${sessionFee}.00</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm">Platform Fee</span>
										<span className="text-sm">${platformFee}.00</span>
									</div>
									<Separator className="my-2" />
									<div className="flex justify-between font-bold">
										<span>Total</span>
										<span>${total}.00</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
