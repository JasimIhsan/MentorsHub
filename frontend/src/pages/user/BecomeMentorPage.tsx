import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { RootState } from "@/store/store";
import PersonalInfoForm from "@/components/user/become-mentor/ProfessionalInfoForm";
import ExpertiseSkillsForm from "@/components/user/become-mentor/ExpertiseSkillForm";
import ExperienceEducationForm from "@/components/user/become-mentor/ExperienceEducationForm";
import MentoringPreferencesForm from "@/components/user/become-mentor/MentoringPreferenceForm";
import DocumentsVerificationForm from "@/components/user/become-mentor/DocumentVerficationForm";
import SubmissionConfirmation from "@/components/user/become-mentor/SubmissionConfirmation";
import { formSchema, MentorApplicationFormData } from "@/schema/mentor.application.form";
import { submitApplication } from "@/api/user/become.mentor.api.service";

export function BecomeMentorPage() {
	const [step, setStep] = useState(3);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const user = useSelector((state: RootState) => state.auth.user);
	const totalSteps = 5;
	const progress = (step / totalSteps) * 100;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
			professionalTitle: "",
			bio: user?.bio || "",
			languages: [],
			primaryExpertise: "",
			skills: user?.skills || [],
			yearsExperience: "",
			workExperiences: [],
			educations: [],
			certifications: [],
			sessionFormat: "both",
			sessionTypes: ["video-calls", "chat"],
			pricing: "paid",
			hourlyRate: "",
			availability: ["weekdays", "evenings"],
			hoursPerWeek: "",
			sessionLength: "",
			documents: [],
			terms: false,
			guidelines: false,
			interview: false,
		},
	});

	const handleNext = async () => {
		const fieldsToValidate = (() => {
			switch (step) {
				case 1:
					return ["firstName", "lastName", "professionalTitle", "bio", "location", "languages"];
				case 2:
					return ["primaryExpertise", "skills", "yearsExperience"];
				case 3:
					return ["workExperiences"];
				case 4:
					return ["sessionFormat", "sessionTypes", "pricing", "availability", "hoursPerWeek", "sessionLength"];
				case 5:
					return ["terms", "guidelines", "interview"];
				default:
					return [];
			}
		})();

		const isValid = await form.trigger(fieldsToValidate as any);
		console.log("isValid: ", isValid);

		if (isValid && step < totalSteps) {
			setStep(step + 1);
			window.scrollTo(0, 0);
		} else if (isValid && step === totalSteps) {
			onSubmit(form.getValues());
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
			window.scrollTo(0, 0);
		}
	};

	const onSubmit = async (data: MentorApplicationFormData) => {
		try {
			const documents = form.getValues("documents") as File[];
			const response = await submitApplication(user?.id as string, data, documents);
			console.log("Application submitted successfully:", response);
			setIsSubmitted(true);
		} catch (error) {
			console.error("Error submitting application:", error);
			form.setError("root", { message: "Failed to submit application. Please try again." });
		}
	};

	if (isSubmitted) {
		return <SubmissionConfirmation />;
	}

	return (
		<div className="container py-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Become a Mentor</h1>
					<p className="text-muted-foreground">Share your expertise and help others grow</p>
				</div>

				<div className="mb-8">
					<div className="flex justify-between text-sm mb-2">
						<span>Application Progress</span>
						<span>
							Step {step} of {totalSteps}
						</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>

				<FormProvider {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<Card>
							<CardHeader>
								<CardTitle>
									{step === 1 && "Personal Information"}
									{step === 2 && "Expertise & Skills"}
									{step === 3 && "Experience & Education"}
									{step === 4 && "Mentoring Preferences"}
									{step === 5 && "Documents & Verification"}
								</CardTitle>
								<CardDescription>
									{step === 1 && "Tell us about yourself"}
									{step === 2 && "Share your areas of expertise and skills"}
									{step === 3 && "Tell us about your professional background"}
									{step === 4 && "Set your mentoring preferences and availability"}
									{step === 5 && "Upload supporting documents and complete your application"}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{step === 1 && <PersonalInfoForm />}
								{step === 2 && <ExpertiseSkillsForm />}
								{step === 3 && <ExperienceEducationForm />}
								{step === 4 && <MentoringPreferencesForm />}
								{step === 5 && <DocumentsVerificationForm />}
							</CardContent>
							<CardFooter className="flex justify-between">
								{step > 1 ? (
									<Button variant="outline" onClick={handleBack} className="gap-2">
										<ArrowLeft className="h-4 w-4" />
										Back
									</Button>
								) : (
									<Button variant="outline" asChild className="gap-2">
										<Link to="/dashboard">
											<ArrowLeft className="h-4 w-4" />
											Cancel
										</Link>
									</Button>
								)}
								<Button type="button" onClick={handleNext} className="gap-2">
									{step < totalSteps ? (
										<>
											Next
											<ArrowRight className="h-4 w-4" />
										</>
									) : (
										<>
											Submit Application
											<ArrowRight className="h-4 w-4" />
										</>
									)}
								</Button>
							</CardFooter>
						</Card>
					</form>
				</FormProvider>
			</div>
		</div>
	);
}
