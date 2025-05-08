import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { BookOpen, BriefcaseBusiness, GraduationCap, Upload, Plus, X, CheckCircle2, ArrowRight, ArrowLeft, IndianRupee } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SKILL_OPTIONS } from "@/data/skill.option";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; // Assuming you have a Dialog component
import { toast } from "sonner";
import axiosInstance from "@/api/config/api.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Define types matching MentorProfileSchema
interface WorkExperience {
	jobTitle: string;
	company: string;
	startDate: string;
	endDate: string;
	currentJob: boolean;
	description: string;
}

interface Education {
	degree: string;
	institution: string;
	startYear: string;
	endYear: string;
}

interface Certification {
	name: string;
	issuingOrg: string;
	issueDate: string;
	expiryDate: string;
}

interface FormData {
	firstName: string;
	lastName: string;
	professionalTitle: string;
	bio: string;
	languages: string[];
	primaryExpertise: string;
	skills: string[];
	yearsExperience: string;
	workExperiences: WorkExperience[];
	educations: Education[];
	certifications: Certification[];
	sessionFormat: "one-on-one" | "group" | "both";
	sessionTypes: string[];
	pricing: "free" | "paid";
	hourlyRate: string;
	availability: string[];
	hoursPerWeek: string;
	documents: File[];
	terms: boolean;
	guidelines: boolean;
	interview: boolean;
}

// Validation function
const validateFormData = (data: FormData): { isValid: boolean; errors: string[] } => {
	const errors: string[] = [];

	if (!data.firstName.trim()) errors.push("First name is required");
	if (!data.lastName.trim()) errors.push("Last name is required");
	if (!data.professionalTitle.trim()) errors.push("Professional title is required");
	if (!data.bio.trim()) errors.push("Professional bio is required");
	if (data.languages.length === 0) errors.push("At least one language is required");
	if (!data.primaryExpertise) errors.push("Primary expertise is required");
	if (data.skills.length === 0) errors.push("At least one skill is required");
	if (!data.yearsExperience) errors.push("Years of experience is required");
	if (!data.sessionFormat) errors.push("Session format is required");
	if (data.sessionTypes.length === 0) errors.push("At least one session type is required");
	if (!data.pricing) errors.push("Pricing preference is required");
	if (data.pricing !== "free" && !data.hourlyRate) errors.push("Hourly rate is required for paid sessions");
	if (data.availability.length === 0) errors.push("At least one availability option is required");
	if (!data.terms) errors.push("You must confirm the accuracy of the information");
	if (!data.guidelines) errors.push("You must agree to the Mentor Guidelines");
	if (!data.interview) errors.push("You must acknowledge the interview possibility");

	data.workExperiences.forEach((exp, index) => {
		if (!exp.jobTitle.trim()) errors.push(`Work experience ${index + 1}: Job title is required`);
		if (!exp.company.trim()) errors.push(`Work experience ${index + 1}: Company is required`);
		if (!exp.startDate) errors.push(`Work experience ${index + 1}: Start date is required`);
		if (!exp.currentJob && !exp.endDate) errors.push(`Work experience ${index + 1}: End date is required unless current job`);
		if (!exp.description.trim()) errors.push(`Work experience ${index + 1}: Description is required`);
	});

	data.educations.forEach((edu, index) => {
		if (!edu.degree.trim()) errors.push(`Education ${index + 1}: Degree is required`);
		if (!edu.institution.trim()) errors.push(`Education ${index + 1}: Institution is required`);
		if (!edu.startYear) errors.push(`Education ${index + 1}: Start year is required`);
		if (!edu.endYear) errors.push(`Education ${index + 1}: End year is required`);
	});

	data.certifications.forEach((cert, index) => {
		if (!cert.name.trim()) errors.push(`Certification ${index + 1}: Name is required`);
		if (!cert.issuingOrg.trim()) errors.push(`Certification ${index + 1}: Issuing organization is required`);
		if (!cert.issueDate) errors.push(`Certification ${index + 1}: Issue date is required`);
	});

	data.documents.forEach((file, index) => {
		const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (!allowedTypes.includes(file.type)) {
			errors.push(`Document ${index + 1}: Only PDF, JPEG, or PNG files are allowed`);
		}
		if (file.size > maxSize) {
			errors.push(`Document ${index + 1}: File size must be less than 5MB`);
		}
	});

	return { isValid: errors.length === 0, errors };
};

export function BecomeMentorPage() {
	const [step, setStep] = useState(1);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const totalSteps = 5;
	const progress = (step / totalSteps) * 100;
	const user = useSelector((state: RootState) => state.auth.user);
	const navigate = useNavigate();

	if (user?.role === "mentor") {
		return (
			<div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100">
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

	const [formData, setFormData] = useState<FormData>({
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
		sessionTypes: [],
		pricing: "free",
		hourlyRate: "",
		availability: [],
		hoursPerWeek: "",
		documents: [],
		terms: false,
		guidelines: false,
		interview: false,
	});

	const handleInputChange = (field: keyof FormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleArrayChange = (field: keyof FormData, value: string, checked: boolean) => {
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
			console.log("userId: ", userId);

			const submissionData = new FormData();
			submissionData.append("userId", userId!);
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
			submissionData.append("sessionTypes", JSON.stringify(formData.sessionTypes));
			submissionData.append("pricing", formData.pricing);
			submissionData.append("hourlyRate", formData.hourlyRate);
			submissionData.append("availability", JSON.stringify(formData.availability));
			submissionData.append("hoursPerWeek", formData.hoursPerWeek);

			formData.documents.forEach((file) => {
				submissionData.append("documents", file); // Use "documents" to match multer.array("documents")
			});

			try {
				console.log("submissionData entries:");
				for (const [key, value] of submissionData.entries()) {
					console.log(`${key}: ${value}`);
				}
				const response = await axiosInstance.post("/user/user-profile/mentor-application", submissionData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				if (!response.data.success) {
					throw new Error("Failed to submit application");
				}

				toast.success(response.data.message);
				console.log(`resonse : `, response.data.data);

				setIsSubmitted(true);
			} catch (error: any) {
				console.error("Submission error:", error);
				// if(error instanceof Error){
				// 	toast.error();
				// }
				toast.error(error.response.data.message);

				// setShowErrorModal(true);
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

	if (isSubmitted) {
		return (
			<div className="container py-10">
				<div className="mx-auto max-w-2xl">
					<Card className="overflow-hidden">
						<div className="bg-gradient-to-r from-primary to-purple-500 p-6 text-center text-white">
							<div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
								<CheckCircle2 className="h-10 w-10 text-white" />
							</div>
							<h1 className="text-3xl font-bold">Application Submitted!</h1>
							<p className="mt-2 text-white/80">Your mentor application has been received</p>
						</div>
						<CardContent className="p-6">
							<div className="space-y-6">
								<div className="rounded-lg bg-primary/5 p-4">
									<h3 className="mb-4 font-medium">What happens next?</h3>
									<ol className="space-y-3 list-decimal list-inside">
										<li className="text-sm">Our admin team will review your application</li>
										<li className="text-sm">You may be contacted for additional information or an interview</li>
										<li className="text-sm">You'll receive a notification once your application is approved or rejected</li>
										<li className="text-sm">If approved, you'll gain access to the mentor dashboard and can start accepting sessions</li>
									</ol>
								</div>
								<div className="rounded-lg border border-dashed p-4 text-center">
									<p className="text-sm text-muted-foreground">The review process typically takes 3-5 business days. You can check your application status in your profile settings.</p>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col gap-3 p-6">
							<Button asChild className="w-full gap-2">
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

	return (
		<>
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
							{step === 1 && (
								<>
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="first-name">First Name</Label>
											<Input id="first-name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
										</div>
										<div className="space-y-2">
											<Label htmlFor="last-name">Last Name</Label>
											<Input id="last-name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="professional-title">Professional Title</Label>
										<Input id="professional-title" value={formData.professionalTitle} onChange={(e) => handleInputChange("professionalTitle", e.target.value)} placeholder="e.g. Senior Software Engineer" required />
									</div>

									<div className="space-y-2">
										<Label htmlFor="bio">Professional Bio</Label>
										<Textarea
											id="bio"
											value={formData.bio}
											onChange={(e) => handleInputChange("bio", e.target.value)}
											placeholder="Tell us about yourself, your expertise, and why you want to be a mentor..."
											className="min-h-[150px]"
											required
										/>
										<p className="text-xs text-muted-foreground">This will be displayed on your mentor profile.</p>
									</div>

									<div className="space-y-2">
										<Label>Languages Spoken</Label>
										<div className="flex space-x-4">
											{["English", "Malayalam", "Hindi", "French", "Spanish", "Tamil", "Telugu", "Kannada"].map((lang) => (
												<div key={lang} className="flex items-center space-x-2">
													<Checkbox id={`lang-${lang}`} checked={formData.languages.includes(lang)} onCheckedChange={(checked) => handleArrayChange("languages", lang, !!checked)} />
													<Label htmlFor={`lang-${lang}`} className="font-normal">
														{lang}
													</Label>
												</div>
											))}
										</div>
										<p className="text-xs text-muted-foreground mt-3">Select all languages you speak fluently.</p>
									</div>
								</>
							)}

							{step === 2 && (
								<>
									<div className="space-y-2">
										<Label htmlFor="expertise">Primary Area of Expertise</Label>
										<Select value={formData.primaryExpertise} onValueChange={(value) => handleInputChange("primaryExpertise", value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select your primary expertise" />
											</SelectTrigger>
											<SelectContent>
												{SKILL_OPTIONS.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label>Skills</Label>
										<MultipleSelector
											value={formData.skills.map((skill) => ({ label: skill, value: skill }))}
											onChange={(options) =>
												handleInputChange(
													"skills",
													options.map((opt) => opt.value)
												)
											}
											defaultOptions={SKILL_OPTIONS}
											placeholder="Select or type skills..."
											creatable
											emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching skills found.</p>}
											className="w-full"
										/>
										<p className="text-xs text-muted-foreground">Add specific skills like 'JavaScript', 'React', 'Data Analysis', etc.</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="years-experience">Years of Experience</Label>
										<Select value={formData.yearsExperience} onValueChange={(value) => handleInputChange("yearsExperience", value)}>
											<SelectTrigger>
												<SelectValue placeholder="Select years of experience" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1-2">1-2 years</SelectItem>
												<SelectItem value="3-5">3-5 years</SelectItem>
												<SelectItem value="6-10">6-10 years</SelectItem>
												<SelectItem value="10+">10+ years</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</>
							)}

							{step === 3 && (
								<>
									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<BriefcaseBusiness className="h-5 w-5 text-primary" />
											<h3 className="font-medium">Work Experience</h3>
										</div>
										{formData.workExperiences.map((exp, index) => (
											<div key={index} className="rounded-lg border p-4 space-y-4 relative">
												<div className="space-y-2">
													<Label htmlFor={`job-title-${index}`}>Job Title</Label>
													<Input id={`job-title-${index}`} value={exp.jobTitle} onChange={(e) => handleNestedChange("workExperiences", index, "jobTitle", e.target.value)} placeholder="e.g. Senior Software Engineer" required />
												</div>
												<div className="space-y-2">
													<Label htmlFor={`company-${index}`}>Company</Label>
													<Input id={`company-${index}`} value={exp.company} onChange={(e) => handleNestedChange("workExperiences", index, "company", e.target.value)} placeholder="e.g. Acme Inc." required />
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor={`start-date-${index}`}>Start Date</Label>
														<Input id={`start-date-${index}`} type="month" value={exp.startDate} onChange={(e) => handleNestedChange("workExperiences", index, "startDate", e.target.value)} required />
													</div>
													<div className="space-y-2">
														<Label htmlFor={`end-date-${index}`}>End Date</Label>
														<Input id={`end-date-${index}`} type="month" value={exp.endDate} disabled={exp.currentJob} onChange={(e) => handleNestedChange("workExperiences", index, "endDate", e.target.value)} />
														<div className="flex items-center space-x-2 mt-1">
															<Checkbox id={`current-job-${index}`} checked={exp.currentJob} onCheckedChange={(checked) => handleNestedChange("workExperiences", index, "currentJob", !!checked)} />
															<Label htmlFor={`current-job-${index}`} className="text-sm font-normal">
																I currently work here
															</Label>
														</div>
													</div>
												</div>
												<div className="space-y-2">
													<Label htmlFor={`job-description-${index}`}>Description</Label>
													<Textarea
														id={`job-description-${index}`}
														value={exp.description}
														onChange={(e) => handleNestedChange("workExperiences", index, "description", e.target.value)}
														placeholder="Describe your responsibilities and achievements..."
														required
													/>
												</div>
												{formData.workExperiences.length > 1 && (
													<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveNested("workExperiences", index)}>
														<X className="h-4 w-4" />
														<span className="sr-only">Remove Experience</span>
													</Button>
												)}
											</div>
										))}
										<Button variant="outline" className="w-full" onClick={() => handleAddNested("workExperiences")}>
											<Plus className="mr-2 h-4 w-4" />
											Add Another Work Experience
										</Button>
									</div>

									<Separator className="my-4" />

									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<GraduationCap className="h-5 w-5 text-primary" />
											<h3 className="font-medium">Education</h3>
										</div>
										{formData.educations.map((edu, index) => (
											<div key={index} className="rounded-lg border p-4 space-y-4 relative">
												<div className="space-y-2">
													<Label htmlFor={`degree-${index}`}>Degree</Label>
													<Input id={`degree-${index}`} value={edu.degree} onChange={(e) => handleNestedChange("educations", index, "degree", e.target.value)} placeholder="e.g. Bachelor of Science in Computer Science" required />
												</div>
												<div className="space-y-2">
													<Label htmlFor={`institution-${index}`}>Institution</Label>
													<Input id={`institution-${index}`} value={edu.institution} onChange={(e) => handleNestedChange("educations", index, "institution", e.target.value)} placeholder="e.g. Stanford University" required />
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor={`edu-start-date-${index}`}>Start Year</Label>
														<Input id={`edu-start-date-${index}`} type="number" value={edu.startYear} onChange={(e) => handleNestedChange("educations", index, "startYear", e.target.value)} placeholder="e.g. 2015" required />
													</div>
													<div className="space-y-2">
														<Label htmlFor={`edu-end-date-${index}`}>End Year</Label>
														<Input id={`edu-end-date-${index}`} type="number" value={edu.endYear} onChange={(e) => handleNestedChange("educations", index, "endYear", e.target.value)} placeholder="e.g. 2019" required />
													</div>
												</div>

												{formData.educations.length > 1 && (
													<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveNested("educations", index)}>
														<X className="h-4 w-4" />
														<span className="sr-only">Remove Education</span>
													</Button>
												)}
											</div>
										))}
										<Button variant="outline" className="w-full" onClick={() => handleAddNested("educations")}>
											<Plus className="mr-2 h-4 w-4" />
											Add Another Education
										</Button>
									</div>

									<Separator className="my-4" />

									<div className="space-y-4">
										<div className="flex items-center gap-2">
											<BookOpen className="h-5 w-5 text-primary" />
											<h3 className="font-medium">Certifications</h3>
										</div>
										{formData.certifications.map((cert, index) => (
											<div key={index} className="rounded-lg border p-4 space-y-4 relative">
												<div className="space-y-2">
													<Label htmlFor={`certification-${index}`}>Certification Name</Label>
													<Input id={`certification-${index}`} value={cert.name} onChange={(e) => handleNestedChange("certifications", index, "name", e.target.value)} placeholder="e.g. AWS Certified Solutions Architect" required />
												</div>
												<div className="space-y-2">
													<Label htmlFor={`issuing-org-${index}`}>Issuing Organization</Label>
													<Input id={`issuing-org-${index}`} value={cert.issuingOrg} onChange={(e) => handleNestedChange("certifications", index, "issuingOrg", e.target.value)} placeholder="e.g. Amazon Web Services" required />
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor={`issue-date-${index}`}>Issue Date</Label>
														<Input id={`issue-date-${index}`} type="month" value={cert.issueDate} onChange={(e) => handleNestedChange("certifications", index, "issueDate", e.target.value)} required />
													</div>
													<div className="space-y-2">
														<Label htmlFor={`expiry-date-${index}`}>Expiry Date (if applicable)</Label>
														<Input id={`expiry-date-${index}`} type="month" value={cert.expiryDate} onChange={(e) => handleNestedChange("certifications", index, "expiryDate", e.target.value)} />
													</div>
												</div>
												{formData.certifications.length > 1 && (
													<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveNested("certifications", index)}>
														<X className="h-4 w-4" />
														<span className="sr-only">Remove Certification</span>
													</Button>
												)}
											</div>
										))}
										<Button variant="outline" className="w-full" onClick={() => handleAddNested("certifications")}>
											<Plus className="mr-2 h-4 w-4" />
											Add Another Certification
										</Button>
									</div>
								</>
							)}

							{step === 4 && (
								<>
									<div className="space-y-4">
										<div className="space-y-2">
											<Label className="font-bold">Session Format</Label>
											<RadioGroup value={formData.sessionFormat} onValueChange={(value) => handleInputChange("sessionFormat", value)}>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="one-on-one" id="one-on-one" />
													<Label htmlFor="one-on-one" className="font-normal">
														One-on-One Sessions Only
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="group" id="group" />
													<Label htmlFor="group" className="font-normal">
														Group Sessions Only
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="both" id="both" />
													<Label htmlFor="both" className="font-normal">
														Both One-on-One and Group Sessions
													</Label>
												</div>
											</RadioGroup>
										</div>

										<div className="space-y-2">
											<Label className="font-bold">Session Type</Label>
											<div className="space-y-2">
												<div className="flex items-center space-x-2">
													<Checkbox id="video-calls" checked={formData.sessionTypes.includes("video-calls")} onCheckedChange={(checked) => handleArrayChange("sessionTypes", "video-calls", !!checked)} />
													<Label htmlFor="video-calls" className="font-normal">
														Video Calls
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<Checkbox id="chat" checked={formData.sessionTypes.includes("chat")} onCheckedChange={(checked) => handleArrayChange("sessionTypes", "chat", !!checked)} />
													<Label htmlFor="chat" className="font-normal">
														Text Chat
													</Label>
												</div>
											</div>
										</div>

										<Separator />

										<div className="space-y-2">
											<Label className="font-bold">Session Pricing</Label>
											<RadioGroup value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value)}>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="free" id="free" />
													<Label htmlFor="free" className="font-normal">
														Free Sessions
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="paid" id="paid" />
													<Label htmlFor="paid" className="font-normal">
														Paid Sessions
													</Label>
												</div>
											</RadioGroup>
										</div>

										<div className="space-y-2">
											<Label className="font-bold" htmlFor="hourly-rate">
												Hourly Rate (INR)
											</Label>
											<div className="relative">
												<IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
												<Input id="hourly-rate" className="pl-9" value={formData.hourlyRate} onChange={(e) => handleInputChange("hourlyRate", e.target.value)} placeholder="e.g. 150" type="number" />
											</div>
											<p className="text-xs text-muted-foreground">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
										</div>

										<Separator />

										<div className="space-y-2">
											<Label className="font-bold">Availability</Label>
											<div className="space-y-2">
												{["weekdays", "weekends", "evenings", "always"].map((option) => (
													<div key={option} className="flex items-center space-x-2">
														<Checkbox id={option} checked={formData.availability.includes(option)} onCheckedChange={(checked) => handleArrayChange("availability", option, !!checked)} />
														<Label htmlFor={option} className="font-normal">
															{option.charAt(0).toUpperCase() + option.slice(1)}
														</Label>
													</div>
												))}
											</div>
										</div>
									</div>
								</>
							)}

							{step === 5 && (
								<>
									<div className="space-y-4">
										<div className="rounded-lg border border-dashed p-6 text-center">
											<div className="flex flex-col items-center gap-2">
												<Upload className="h-8 w-8 text-muted-foreground" />
												<h3 className="font-medium">Upload Supporting Documents</h3>
												<p className="text-sm text-muted-foreground">Upload your resume, certifications, or any other documents that verify your expertise</p>
												<Button variant="outline" asChild>
													<label htmlFor="document-upload">
														<Upload className="mr-2 h-4 w-4" />
														Select Files
														<input id="document-upload" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
													</label>
												</Button>
											</div>
										</div>

										{formData.documents.length > 0 && (
											<div className="space-y-2">
												<Label>Uploaded Documents</Label>
												<div className="space-y-2">
													{formData.documents.map((file, index) => (
														<div key={index} className="flex items-center justify-between rounded-lg border p-3">
															<div className="flex items-center gap-2">
																<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
																	<BookOpen className="h-5 w-5 text-primary" />
																</div>
																<div>
																	<p className="font-medium">{file.name}</p>
																	<p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
																</div>
															</div>
															<Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
																<X className="h-4 w-4" />
																<span className="sr-only">Remove {file.name}</span>
															</Button>
														</div>
													))}
												</div>
											</div>
										)}

										<Separator />

										<div className="space-y-2">
											<Label>Verification</Label>
											<div className="space-y-4">
												<div className="flex items-center space-x-2">
													<Checkbox id="terms" checked={formData.terms} onCheckedChange={(checked) => handleInputChange("terms", !!checked)} />
													<Label htmlFor="terms" className="text-sm font-normal">
														I confirm that all information provided is accurate and complete
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<Checkbox id="guidelines" checked={formData.guidelines} onCheckedChange={(checked) => handleInputChange("guidelines", !!checked)} />
													<Label htmlFor="guidelines" className="text-sm font-normal">
														I have read and agree to the Mentor Guidelines and Code of Conduct
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<Checkbox id="interview" checked={formData.interview} onCheckedChange={(checked) => handleInputChange("interview", !!checked)} />
													<Label htmlFor="interview" className="text-sm font-normal">
														I understand that I may be contacted for an interview as part of the verification process
													</Label>
												</div>
											</div>
										</div>

										<div className="rounded-lg bg-muted p-4">
											<h3 className="font-medium mb-2">What happens next?</h3>
											<ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
												<li>Our admin team will review your application</li>
												<li>You may be contacted for additional information or an interview</li>
												<li>You'll receive a notification once your application is approved or rejected</li>
												<li>If approved, you'll gain access to the mentor dashboard and can start accepting sessions</li>
											</ol>
										</div>
									</div>
								</>
							)}
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
							<Button onClick={handleNext} className="gap-2">
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
				</div>
			</div>

			{/* Error Modal */}
			<Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Validation Errors</DialogTitle>
						<DialogDescription>Please fix the following issues to submit your application:</DialogDescription>
					</DialogHeader>
					<div className="max-h-[60vh] overflow-y-auto">
						<ul className="list-disc pl-5 space-y-2 text-sm text-red-600">
							{validationErrors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
					<DialogFooter>
						<Button onClick={() => setShowErrorModal(false)}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
