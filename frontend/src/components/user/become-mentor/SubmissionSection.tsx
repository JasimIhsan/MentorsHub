// src/components/mentor-application/SubmissionSuccess.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SubmissionSuccess() {
	return (
		<div className="container py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-2xl">
				<Card>
					<div className="bg-gradient-to-r from-primary to-purple-500 p-6 text-center text-white">
						<div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
							<CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
						</div>
						<h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Application Submitted!</h1>
						<p className="mt-2 text-white/80 text-sm sm:text-base">Your mentor application has been received</p>
					</div>
					<CardContent className="p-4 sm:p-6">
						<div className="space-y-6">
							<div className="rounded-lg bg-primary/5 p-4">
								<h3 className="mb-4 font-medium text-sm sm:text-base">What's Next?</h3>
								<ol className="space-y-3 list-decimal list-inside text-sm sm:text-base">
									<li>Our admin team will review your application</li>
									<li>You may be contacted for additional information or an interview</li>
									<li>You'll receive a notification once your application is approved or rejected</li>
									<li>If approved, you'll gain access to the mentor dashboard and can start accepting sessions</li>
								</ol>
							</div>
							<div className="rounded-lg border border-dashed p-4 text-center">
								<p className="text-xs sm:text-sm text-muted-foreground">The review process typically takes 3-5 business days. You can check your application status in your profile settings.</p>
							</div>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6">
						<Button asChild className="w-full sm:w-auto gap-2">
							<Link to="/dashboard">
								Back to Dashboard
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
