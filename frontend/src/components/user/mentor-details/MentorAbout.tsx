import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Award, Briefcase, GraduationCap, Clock, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { IMentorDTO } from "@/interfaces/mentor.interface";

interface MentorAboutProps {
	mentor: IMentorDTO;
}

export function MentorAbout({ mentor }: MentorAboutProps) {
	return (
		<div className="grid gap-6 md:grid-cols-3">
			<div className="md:col-span-2">
				<Card>
					<CardHeader>
						<CardTitle>About Me</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="leading-relaxed">{mentor.bio || "No biography provided."}</p>
						<div className="mt-8 grid gap-6 sm:grid-cols-2">
							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<Award className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 className="font-medium">Expertise</h3>
									<p className="text-sm text-muted-foreground">{mentor.skills && mentor.skills.length > 0 ? mentor.skills.join(", ") : "No skills listed"}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<Briefcase className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 className="font-medium">Experience</h3>
									<p className="text-sm text-muted-foreground">{mentor.yearsExperience ?? "Not specified"}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<GraduationCap className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 className="font-medium">Education</h3>
									<p className="text-sm text-muted-foreground max-w-2xs">
										{mentor.educations && mentor.educations.length > 0
											? mentor.educations.map((edu) => `${edu.degree || "Unknown"} from ${edu.institution || "Unknown"} (${edu.startYear || "N/A"}-${edu.endYear || "N/A"})`).join(", ")
											: "No education listed"}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<Clock className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 className="font-medium">Availability</h3>
									<p className="text-sm text-muted-foreground">{mentor.availability ? "Available" : "Not specified"}</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<Heart className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 className="font-medium">Interests</h3>
									<p className="text-sm text-muted-foreground">{mentor.interests && mentor.interests.length > 0 ? mentor.interests.join(", ") : "No interests listed"}</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<div>
				<Card>
					<CardHeader>
						<CardTitle>Session Preferences</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<span className="font-medium">Rate</span>
								<span>{mentor.pricing === "free" ? "Free" : mentor.pricing === "paid" ? `${mentor.hourlyRate || "Contact for details"}/hr` : "Free or Paid"}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="font-medium">Session Length</span>
								<span>60 minutes</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="font-medium">Format</span>
								<div className="flex items-center gap-1">
									<Users className="h-4 w-4" />
									<span>{mentor.sessionFormat === "one-on-one" ? "One-on-One" : mentor.sessionFormat === "group" ? "Group" : "Not specified"}</span>
								</div>
							</div>
							<div className="pt-4">
								<Button className="w-full" asChild disabled={!mentor.userId}>
									<Link to={`/request-session/${mentor.userId || ""}`}>Request a Session</Link>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
