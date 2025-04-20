import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle, CalendarDays, Clock, MessageSquare, ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";

export function PaymentConfirmationPage() {
	return (
		<div className="container py-8">
			<div className="mx-auto max-w-lg">
				<Card className="overflow-hidden p-0">
					<div className="bg-gradient-to-r from-primary to-blue-500 p-6 text-center text-white">
						<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
							<CheckCircle className="h-10 w-10 text-white" />
						</div>
						<h1 className="text-3xl font-bold">Payment Successful!</h1>
						<p className="mt-2 text-white/80">Your session has been booked successfully</p>
					</div>
					<CardContent className="p-6">
						<div className="space-y-6">
							<div className="rounded-lg bg-primary/5 p-4">
								<h3 className="mb-4 font-medium">Session Details</h3>
								<div className="space-y-3">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
											<CalendarDays className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Date</p>
											<p className="font-medium">Wednesday, March 22, 2025</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
											<Clock className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Time</p>
											<p className="font-medium">2:00 PM - 3:00 PM</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
											<MessageSquare className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">Mentor</p>
											<p className="font-medium">Sarah Johnson</p>
										</div>
									</div>
								</div>
							</div>
							<div className="flex justify-center">
								<Button variant="outline" className="gap-2">
									<Download className="h-4 w-4" />
									Add to Calendar
								</Button>
							</div>
							<div className="rounded-lg border border-dashed p-4 text-center">
								<p className="text-sm text-muted-foreground">You'll receive an email with the session details and a calendar invitation. The video call link will be available 15 minutes before the session starts.</p>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col gap-3 p-6">
						<Button asChild className="w-full gap-2">
							<Link to="/sessions">
								View My Sessions
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
						<Button variant="outline" asChild className="w-full">
							<Link to="/dashboard">Back to Dashboard</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
