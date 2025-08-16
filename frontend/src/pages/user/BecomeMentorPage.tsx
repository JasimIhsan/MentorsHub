import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axiosInstance from "@/api/config/api.config";
import { fetchMentorAPI } from "@/api/mentors.api.service";
import { RootState } from "@/store/store";
import { MentorApplicationFormData } from "@/interfaces/mentor.application";
import { DocumentsVerificationStep } from "@/components/user/become-mentor/DocumentsVerificationStep";
import { ExperienceEducationStep } from "@/components/user/become-mentor/ExpericeEducationStep";
import { ExpertiseSkillsStep } from "@/components/user/become-mentor/ExpertiseSkillsStep";
import { MentoringPreferencesStep } from "@/components/user/become-mentor/MentoringPreferenceStep";
import { PersonalInfoStep } from "@/components/user/become-mentor/PersonalInfoStep";
import { SubmissionSuccess } from "@/components/user/become-mentor/SubmissionSuccess";
import { ValidationErrorModal } from "@/components/user/become-mentor/ValidationErrorModal";
import { AxiosError } from "axios";
import { validateFormData } from "@/schema/mentor.application.form";

export function BecomeMentorPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [step, setStep] = useState(Number(searchParams.get("step")) || 1);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const totalSteps = 5;
	const progress = (step / totalSteps) * 100;
	const user = useSelector((state: RootState) => state.userAuth.user);
	const navigate = useNavigate();

	const [formData, setFormData] = useState<MentorApplicationFormData>({
		firstName: user?.firstName || "",
		lastName: user?.lastName || "",
		professionalTitle: "",
		bio: user?.bio || "",
		languages: [],
		primaryExpertise: "",
		skills: user?.skills || [],
		yearsExperience: "",
		workExperiences: [{ jobTitle: "", company: "", startDate: "", endDate: "", currentJob: false, description: "" }],
		educations: [{ degree: "", institution: "", startYear: "", endYear: "" }],
		certifications: [{ name: "", issuingOrg: "", issueDate: "", expiryDate: "" }],
		sessionFormat: "both",
		pricing: "free",
		hourlyRate: 0,
		documents: [],
		terms: false,
		guidelines: false,
		interview: false,
	});

	useEffect(() => {
		const params = new URLSearchParams();
		params.set("step", step.toString());
		setSearchParams(params, { replace: true });
	}, [step, setSearchParams]);

	useEffect(() => {
		const fetchUser = async (userId: string) => {
			setIsLoading(true);
			try {
				const response = await fetchMentorAPI(userId);
				const mentorData = response.mentor;
				if (mentorData && user?.mentorRequestStatus === "rejected") {
					setFormData({
						firstName: mentorData.firstName || user?.firstName || "",
						lastName: mentorData.lastName || user?.lastName || "",
						professionalTitle: mentorData.professionalTitle || "",
						bio: mentorData.bio || user?.bio || "",
						languages: mentorData.languages || [],
						primaryExpertise: mentorData.primaryExpertise || "",
						skills: mentorData.skills || user?.skills || [],
						yearsExperience: mentorData.yearsExperience || "",
						workExperiences: mentorData.workExperiences.length > 0 ? mentorData.workExperiences : [{ jobTitle: "", company: "", startDate: "", endDate: "", currentJob: false, description: "" }],
						educations: mentorData.educations.length > 0 ? mentorData.educations : [{ degree: "", institution: "", startYear: "", endYear: "" }],
						certifications: mentorData.certifications.length > 0 ? mentorData.certifications : [{ name: "", issuingOrg: "", issueDate: "", expiryDate: "" }],
						sessionFormat: mentorData.sessionFormat || "one-on-one",
						pricing: mentorData.pricing || "free",
						hourlyRate: mentorData.hourlyRate || 0,
						documents: [],
						terms: false,
						guidelines: false,
						interview: false,
					});
				}
			} catch (error) {
				console.error("Error fetching mentor data:", error);
				toast.error("Failed to load previous application data. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		if (user?.mentorRequestStatus === "rejected" && user?.id) {
			fetchUser(user.id);
		}
	}, [user]);

	const handleInputChange = (field: keyof MentorApplicationFormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleArrayChange = (field: keyof MentorApplicationFormData, value: string, checked: boolean) => {
		setFormData((prev) => {
			const current = prev[field] as string[];
			if (checked) {
				return { ...prev, [field]: [...current, value] };
			} else {
				return { ...prev, [field]: current.filter((item) => item !== value) };
			}
		});
	};

	const handleNestedChange = (field: "workExperiences" | "educations" | "certifications", index: number, subField: string, value: any) => {
		setFormData((prev) => {
			const updated = [...(prev[field] as any[])];
			updated[index] = { ...updated[index], [subField]: value };
			return { ...prev, [field]: updated };
		});
	};

	const handleAddNested = (field: "workExperiences" | "educations" | "certifications") => {
		setFormData((prev) => {
			if (field === "workExperiences") {
				return {
					...prev,
					workExperiences: [...prev.workExperiences, { jobTitle: "", company: "", startDate: "", endDate: "", currentJob: false, description: "" }],
				};
			} else if (field === "educations") {
				return {
					...prev,
					educations: [...prev.educations, { degree: "", institution: "", startYear: "", endYear: "" }],
				};
			} else {
				return {
					...prev,
					certifications: [...prev.certifications, { name: "", issuingOrg: "", issueDate: "", expiryDate: "" }],
				};
			}
		});
	};

	const handleRemoveNested = (field: "workExperiences" | "educations" | "certifications", index: number) => {
		setFormData((prev) => ({
			...prev,
			[field]: (prev[field] as any[]).filter((_, i) => i !== index),
		}));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setFormData((prev) => ({
				...prev,
				documents: [...prev.documents, ...newFiles],
			}));
		}
	};

	const handleRemoveFile = (index: number) => {
		setFormData((prev) => ({
			...prev,
			documents: prev.documents.filter((_, i) => i !== index),
		}));
	};

	const handleNext = async () => {
		if (step === totalSteps) {
			const { isValid, errors } = validateFormData(formData);
			if (!isValid) {
				setValidationErrors(errors);
				setShowErrorModal(true);
				return;
			}

			const userId = user?.id;
			if (!userId) {
				toast.error("User ID is missing. Please log in and try again.");
				navigate("/login");
				return;
			}

			setIsLoading(true);
			const submissionData = new FormData();
			submissionData.append("userId", userId);
			submissionData.append("firstName", formData.firstName);
			submissionData.append("lastName", formData.lastName);
			submissionData.append("bio", formData.bio);
			submissionData.append("professionalTitle", formData.professionalTitle);
			submissionData.append("languages", JSON.stringify(formData.languages));
			submissionData.append("primaryExpertise", formData.primaryExpertise);
			submissionData.append("skills", JSON.stringify(formData.skills));
			submissionData.append("yearsExperience", formData.yearsExperience);
			submissionData.append("workExperiences", JSON.stringify(formData.workExperiences));
			submissionData.append("educations", JSON.stringify(formData.educations));
			submissionData.append("certifications", JSON.stringify(formData.certifications));
			submissionData.append("sessionFormat", formData.sessionFormat);
			submissionData.append("pricing", formData.pricing);
			submissionData.append("hourlyRate", formData.hourlyRate.toString());

			formData.documents.forEach((file) => {
				submissionData.append("documents", file);
			});

			try {
				const endpoint = user?.mentorRequestStatus === "rejected" ? "/user/user-profile/mentor-application/resend" : "/user/user-profile/mentor-application";
				const response = await axiosInstance.post(endpoint, submissionData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				if (!response.data.success) {
					toast.error(response.data.message);
				}

				toast.success(response.data.message);
				setIsSubmitted(true);
			} catch (error) {
				console.error("Submission error:", error);
				const errorMessage = error instanceof AxiosError && error.response?.data?.message ? error.response.data.message : "An error occurred while submitting your application. Please try again.";
				toast.error(errorMessage);
				setValidationErrors([errorMessage]);
				setShowErrorModal(true);
			} finally {
				setIsLoading(false);
			}
		} else {
			setStep(step + 1);
			window.scrollTo(0, 0);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
			window.scrollTo(0, 0);
		}
	};

	if (user?.role === "mentor") {
		return (
			<div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
				<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg text-center">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">You are already a mentor</h1>
					<p className="mt-4 text-gray-600">Thank you for your dedication! As a mentor, you're already making a difference. Continue to guide and inspire through your dashboard.</p>
					<Button size="lg" onClick={() => navigate("/mentor/dashboard")}>
						Go to Mentor Dashboard
					</Button>
				</div>
			</div>
		);
	}

	if (isSubmitted) {
		return <SubmissionSuccess user={user} />;
	}

	return (
		<div className="container py-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">{user?.mentorRequestStatus === "rejected" ? "Re-apply to Become a Mentor" : "Become a Mentor"}</h1>
					<p className="text-gray-500">{user?.mentorRequestStatus === "rejected" ? "Update your application to become a mentor and share your expertise" : "Share your expertise and help others grow"}</p>
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
							{step === 4 && "Set your mentoring preferences"}
							{step === 5 && "Upload supporting documents and complete your application"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{step === 1 && <PersonalInfoStep formData={formData} handleInputChange={handleInputChange} handleArrayChange={handleArrayChange} />}
						{step === 2 && <ExpertiseSkillsStep formData={formData} handleInputChange={handleInputChange} />}
						{step === 3 && <ExperienceEducationStep formData={formData} handleNestedChange={handleNestedChange} handleAddNested={handleAddNested} handleRemoveNested={handleRemoveNested} />}
						{step === 4 && <MentoringPreferencesStep formData={formData} handleInputChange={handleInputChange} handleArrayChange={handleArrayChange} />}
						{step === 5 && <DocumentsVerificationStep formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} />}
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
						<Button onClick={handleNext} className="gap-2" disabled={isLoading}>
							{isLoading && step === totalSteps ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Submitting...
								</>
							) : step < totalSteps ? (
								<>
									Next
									<ArrowRight className="h-4 w-4" />
								</>
							) : (
								<>
									{user?.mentorRequestStatus === "rejected" ? "Update Application" : "Submit Application"}
									<ArrowRight className="h-4 w-4" />
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			</div>

			<ValidationErrorModal showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} validationErrors={validationErrors} />
		</div>
	);
}
