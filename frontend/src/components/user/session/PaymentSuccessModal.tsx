import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MessageSquare, CheckCircle, ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

export function PaymentSuccessModal({ isOpen, onClose, session }: { isOpen: boolean; onClose: () => void; session: ISessionUserDTO }) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-lg p-0 overflow-hidden">
				<div className="bg-primary to-blue-500 p-4 text-center text-white">
					<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
						<CheckCircle className="h-10 w-10 text-white" />
					</div>
					<DialogHeader>
						<DialogTitle className="text-3xl font-bold text-white text-center">Payment Successful!</DialogTitle>
					</DialogHeader>
					<p className="mt-2 text-white/80">Your session has been booked.</p>
				</div>
				<div className="px-6">
					<div className="space-y-2">
						<div className="rounded-lg bg-primary/5 p-4">
							<h3 className="mb-4 font-medium">Session Details</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<CalendarDays className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Date</p>
										<p className="font-medium">{formatDate(session.date)}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<Clock className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Time</p>
										<p className="font-medium">{`${formatTime(session.startTime)} - ${formatTime(session.endTime)}`}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<MessageSquare className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Mentor</p>
										<p className="font-medium">{`${session.mentor.firstName} ${session.mentor.lastName}`}</p>
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
							<p className="text-sm text-muted-foreground">You'll receive an email with session details and a calendar invite.</p>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-3 px-6 pb-6 bg-background">
					<Button asChild className="w-full gap-2">
						<Link to="/sessions" onClick={onClose}>
							View My Sessions
							<ArrowRight className="h-4 w-4" />
						</Link>
					</Button>
					<Button variant="outline" asChild className="w-full" onClick={onClose}>
						<Link to="/dashboard">Back to Dashboard</Link>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
