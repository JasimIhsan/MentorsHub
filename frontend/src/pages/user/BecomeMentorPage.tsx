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
import { BookOpen, BriefcaseBusiness, GraduationCap, Upload, Plus, X, CheckCircle2, ArrowRight, ArrowLeft, IndianRupee, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SKILL_OPTIONS } from "@/data/skill.option";
import MultipleSelector from "@/components/ui/multiple-selector";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosInstance from "@/api/api.config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Define types
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
	pricing: "free" | "paid" | "both-pricing";
	hourlyRate: string;
	availability: string[];
	hoursPerWeek: string;
	documents: File[];
	terms: boolean;
	guidelines: boolean;
	interview: boolean;
}

interface FormErrors {
	[key: string]: string;
}

// Validation function
const validateFormData = (data: FormData): { isValid: boolean; errors: FormErrors } => {
	const errors: FormErrors = {};
	const currentYear = new Date().getFullYear();
	const currentDate = new Date();

	// Basic fields
	if (!data.firstName.trim()) errors.firstName = "First name is required";
	if (!data.lastName.trim()) errors.lastName = "Last name is required";
	if (!data.professionalTitle.trim()) errors.professionalTitle = "Professional title is required";
	if (!data.bio.trim()) errors.bio = "Professional bio is required";
	if (data.languages.length === 0) errors.languages = "At least one language is required";
	if (!data.primaryExpertise) errors.primaryExpertise = "Primary expertise is required";
	if (data.skills.length === 0) errors.skills = "At least one skill is required";
	if (!data.yearsExperience) errors.yearsExperience = "Years of experience is required";
	if (!data.sessionFormat) errors.sessionFormat = "Session format is required";
	if (data.sessionTypes.length === 0) errors.sessionTypes = "At least one session type is required";
	if (!data.pricing) errors.pricing = "Pricing preference is required";
	if (data.pricing !== "free" && !data.hourlyRate) errors.hourlyRate = "Hourly rate is required for paid sessions";
	if (data.pricing !== "free" && Number(data.hourlyRate) <= 0) errors.hourlyRate = "Hourly rate must be greater than 0";
	if (data.availability.length === 0) errors.availability = "At least one availability option is required";
	if (!data.hoursPerWeek) errors.hoursPerWeek = "Hours per week is required";
	if (Number(data.hoursPerWeek) <= 0) errors.hoursPerWeek = "Hours per week must be greater than 0";
	if (!data.terms) errors.terms = "You must confirm the accuracy of the information";
	if (!data.guidelines) errors.guidelines = "You must agree to the Mentor Guidelines";
	if (!data.interview) errors.interview = "You must acknowledge the interview possibility";

	// Work Experiences
	data.workExperiences.forEach((exp, index) => {
		if (!exp.jobTitle.trim()) errors[`workExperiences[${index}].jobTitle`] = "Job title is required";
		if (!exp.company.trim()) errors[`workExperiences[${index}].company`] = "Company is required";
		if (!exp.startDate) errors[`workExperiences[${index}].startDate`] = "Start date is required";
		if (!exp.currentJob && !exp.endDate) errors[`workExperiences[${index}].endDate`] = "End date is required unless current job";
		if (!exp.description.trim()) errors[`workExperiences[${index}].description`] = "Description is required";

		if (exp.startDate) {
			const start = new Date(exp.startDate);
			if (start > currentDate) errors[`workExperiences[${index}].startDate`] = "Start date cannot be in the future";
			if (!exp.currentJob && exp.endDate) {
				const end = new Date(exp.endDate);
				if (end < start) errors[`workExperiences[${index}].endDate`] = "End date must be after start date";
				if (end > currentDate) errors[`workExperiences[${index}].endDate`] = "End date cannot be in the future";
			}
		}
	});

	// Educations
	data.educations.forEach((edu, index) => {
		if (!edu.degree.trim()) errors[`educations[${index}].degree`] = "Degree is required";
		if (!edu.institution.trim()) errors[`educations[${index}].institution`] = "Institution is required";
		if (!edu.startYear) errors[`educations[${index}].startYear`] = "Start year is required";
		if (!edu.endYear) errors[`educations[${index}].endYear`] = "End year is required";

		if (edu.startYear) {
			if (!/^\d{4}$/.test(edu.startYear)) errors[`educations[${index}].startYear`] = "Start year must be a 4-digit number";
			if (Number(edu.startYear) > currentYear) errors[`educations[${index}].startYear`] = "Start year cannot be in the future";
			if (Number(edu.startYear) < 1900) errors[`educations[${index}].startYear`] = "Start year is too early";
		}
		if (edu.endYear) {
			if (!/^\d{4}$/.test(edu.endYear)) errors[`educations[${index}].endYear`] = "End year must be a 4-digit number";
			if (Number(edu.endYear) > currentYear) errors[`educations[${index}].endYear`] = "End year cannot be in the future";
			if (edu.startYear && Number(edu.endYear) < Number(edu.startYear)) errors[`educations[${index}].endYear`] = "End year must be after start year";
		}
	});

	// Certifications
	data.certifications.forEach((cert, index) => {
		if (!cert.name.trim()) errors[`certifications[${index}].name`] = "Name is required";
		if (!cert.issuingOrg.trim()) errors[`certifications[${index}].issuingOrg`] = "Issuing organization is required";
		if (!cert.issueDate) errors[`certifications[${index}].issueDate`] = "Issue date is required";

		if (cert.issueDate) {
			const issue = new Date(cert.issueDate);
			if (issue > currentDate) errors[`certifications[${index}].issueDate`] = "Issue date cannot be in the future";
		}
		if (cert.expiryDate) {
			const issue = new Date(cert.issueDate);
			const expiry = new Date(cert.expiryDate);
			if (issue && expiry < issue) errors[`certifications[${index}].expiryDate`] = "Expiry date must be after issue date";
		}
	});

	// Documents
	data.documents.forEach((file, index) => {
		const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (!allowedTypes.includes(file.type)) {
			errors[`documents[${index}]`] = "Only PDF, JPEG, or PNG files are allowed";
		}
		if (file.size > maxSize) {
			errors[`documents[${index}]`] = "File size must be less than 5MB";
		}
	});

	return { isValid: Object.keys(errors).length === 0, errors };
};

export function BecomeMentorPage() {
	const [step, setStep] = useState(1);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formErrors, setFormErrors] = useState<FormErrors>({});
	const totalSteps = 5;
	const progress = (step / totalSteps) * 100;
	const user = useSelector((state: RootState) => state.auth.user);

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
		pricing: "both-pricing",
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
		setFormErrors((prev) => ({ ...prev, [field]: "" }));
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
		setFormErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const handleNestedChange = (field: "workExperiences" | "educations" | "certifications", index: number, subField: string, value: any) => {
		setFormData((prev) => {
			const updated = [...(prev[field] as any[])];
			updated[index] = { ...updated[index], [subField]: value };
			return { ...prev, [field]: updated };
		});
		setFormErrors((prev) => ({ ...prev, [`${field}[${index}].${subField}`]: "" }));
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
		setFormErrors((prev) => {
			const newErrors = { ...prev };
			Object.keys(newErrors).forEach((key) => {
				if (key.startsWith(`${field}[${index}]`)) {
					delete newErrors[key];
				}
			});
			return newErrors;
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const newFiles = Array.from(e.target.files);
			setFormData((prev) => ({
				...prev,
				documents: [...prev.documents, ...newFiles],
			}));
			setFormErrors((prev) => {
				const newErrors = { ...prev };
				newFiles.forEach((_, index) => {
					delete newErrors[`documents[${prev.documents.length + index}]`];
				});
				return newErrors;
			});
		}
	};

	const handleRemoveFile = (index: number) => {
		setFormData((prev) => ({
			...prev,
			documents: prev.documents.filter((_, i) => i !== index),
		}));
		setFormErrors((prev) => ({ ...prev, [`documents[${index}]`]: "" }));
	};

	const handleNext = async () => {
		if (step === totalSteps) {
			const { isValid, errors } = validateFormData(formData);
			setFormErrors(errors);
			if (!isValid) {
				setShowErrorModal(true);
				return;
			}

			setIsLoading(true);
			const userId = user?.id;
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
				submissionData.append("documents", file);
			});

			try {
				const response = await axiosInstance.post("/user-profile/mentor-application", submissionData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				if (!response.data.success) {
					throw new Error("Failed to submit application");
				}

				toast.success(response.data.message);
				setIsSubmitted(true);
			} catch (error: any) {
				toast.error(error.response?.data?.message || "Failed to submit application");
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

	if (isSubmitted) {
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

	return (
		<div className="container py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-6 sm:mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Become a Mentor</h1>
					<p className="text-muted-foreground text-sm sm:text-base">Share your expertise and help others grow</p>
				</div>

				<div className="mb-6 sm:mb-8">
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
						<CardTitle className="text-xl sm:text-2xl">
							{step === 1 && "Personal Information"}
							{step === 2 && "Expertise & Skills"}
							{step === 3 && "Experience & Education"}
							{step === 4 && "Mentoring Preferences"}
							{step === 5 && "Documents & Verification"}
						</CardTitle>
						<CardDescription className="text-sm sm:text-base">
							{step === 1 && "Tell us about yourself"}
							{step === 2 && "Share your areas of expertise and skills"}
							{step === 3 && "Tell us about your professional background"}
							{step === 4 && "Set your mentoring preferences and availability"}
							{step === 5 && "Upload supporting documents and complete your application"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{step === 1 && (
							<div className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first-name">First Name</Label>
										<Input id="first-name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className={formErrors.firstName ? "border-red-500" : ""} />
										{formErrors.firstName && <p className="text-red-500 text-xs">{formErrors.firstName}</p>}
									</div>
									<div className="space-y-2">
										<Label htmlFor="last-name">Last Name</Label>
										<Input id="last-name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className={formErrors.lastName ? "border-red-500" : ""} />
										{formErrors.lastName && <p className="text-red-500 text-xs">{formErrors.lastName}</p>}
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="professional-title">Professional Title</Label>
									<Input
										id="professional-title"
										value={formData.professionalTitle}
										onChange={(e) => handleInputChange("professionalTitle", e.target.value)}
										placeholder="e.g. Senior Software Engineer"
										className={formErrors.professionalTitle ? "border-red-500" : ""}
									/>
									{formErrors.professionalTitle && <p className="text-red-500 text-xs">{formErrors.professionalTitle}</p>}
								</div>

								<div className="space-y-2">
									<Label htmlFor="bio">Professional Bio</Label>
									<Textarea
										id="bio"
										value={formData.bio}
										onChange={(e) => handleInputChange("bio", e.target.value)}
										placeholder="Tell us about yourself, your expertise, and why you want to be a mentor..."
										className={`min-h-[120px] sm:min-h-[150px] ${formErrors.bio ? "border-red-500" : ""}`}
									/>
									{formErrors.bio && <p className="text-red-500 text-xs">{formErrors.bio}</p>}
									<p className="text-xs text-muted-foreground">This will be displayed on your mentor profile.</p>
								</div>

								<div className="space-y-2">
									<Label>Languages Spoken</Label>
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
										{["English", "Malayalam", "Hindi", "French", "Spanish", "Tamil", "Telugu", "Kannada"].map((lang) => (
											<div key={lang} className="flex items-center space-x-2">
												<Checkbox id={`lang-${lang}`} checked={formData.languages.includes(lang)} onCheckedChange={(checked) => handleArrayChange("languages", lang, !!checked)} />
												<Label htmlFor={`lang-${lang}`} className="text-sm font-normal">
													{lang}
												</Label>
											</div>
										))}
									</div>
									{formErrors.languages && <p className="text-red-500 text-xs mt-2">{formErrors.languages}</p>}
									<p className="text-xs text-muted-foreground mt-2">Select all languages you speak fluently.</p>
								</div>
							</div>
						)}

						{step === 2 && (
							<div className="space-y-6">
								<div className="space-y-2">
									<Label htmlFor="expertise">Primary Area of Expertise</Label>
									<Select value={formData.primaryExpertise} onValueChange={(value) => handleInputChange("primaryExpertise", value)}>
										<SelectTrigger className={formErrors.primaryExpertise ? "border-red-500" : ""}>
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
									{formErrors.primaryExpertise && <p className="text-red-500 text-xs">{formErrors.primaryExpertise}</p>}
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
										className={`w-full ${formErrors.skills ? "border-red-500" : ""}`}
									/>
									{formErrors.skills && <p className="text-red-500 text-xs">{formErrors.skills}</p>}
									<p className="text-xs text-muted-foreground">Add specific skills like 'JavaScript', 'React', 'Data Analysis', etc.</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="years-experience">Years of Experience</Label>
									<Select value={formData.yearsExperience} onValueChange={(value) => handleInputChange("yearsExperience", value)}>
										<SelectTrigger className={formErrors.yearsExperience ? "border-red-500" : ""}>
											<SelectValue placeholder="Select years of experience" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1-2">1-2 years</SelectItem>
											<SelectItem value="3-5">3-5 years</SelectItem>
											<SelectItem value="6-10">6-10 years</SelectItem>
											<SelectItem value="10+">10+ years</SelectItem>
										</SelectContent>
									</Select>
									{formErrors.yearsExperience && <p className="text-red-500 text-xs">{formErrors.yearsExperience}</p>}
								</div>
							</div>
						)}

						{step === 3 && (
							<div className="space-y-8">
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<BriefcaseBusiness className="h-5 w-5 text-primary" />
										<h3 className="font-medium text-base sm:text-lg">Work Experience</h3>
									</div>
									{formData.workExperiences.map((exp, index) => (
										<div key={index} className="rounded-lg border p-4 space-y-4 relative">
											<div className="space-y-2">
												<Label htmlFor={`job-title-${index}`}>Job Title</Label>
												<Input
													id={`job-title-${index}`}
													value={exp.jobTitle}
													onChange={(e) => handleNestedChange("workExperiences", index, "jobTitle", e.target.value)}
													placeholder="e.g. Senior Software Engineer"
													className={formErrors[`workExperiences[${index}].jobTitle`] ? "border-red-500" : ""}
												/>
												{formErrors[`workExperiences[${index}].jobTitle`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].jobTitle`]}</p>}
											</div>
											<div className="space-y-2">
												<Label htmlFor={`company-${index}`}>Company</Label>
												<Input
													id={`company-${index}`}
													value={exp.company}
													onChange={(e) => handleNestedChange("workExperiences", index, "company", e.target.value)}
													placeholder="e.g. Acme Inc."
													className={formErrors[`workExperiences[${index}].company`] ? "border-red-500" : ""}
												/>
												{formErrors[`workExperiences[${index}].company`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].company`]}</p>}
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`start-date-${index}`}>Start Date</Label>
													<Input
														id={`start-date-${index}`}
														type="month"
														value={exp.startDate}
														onChange={(e) => handleNestedChange("workExperiences", index, "startDate", e.target.value)}
														max={new Date().toISOString().slice(0, 7)}
														className={formErrors[`workExperiences[${index}].startDate`] ? "border-red-500" : ""}
													/>
													{formErrors[`workExperiences[${index}].startDate`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].startDate`]}</p>}
												</div>
												<div className="space-y-2">
													<Label htmlFor={`end-date-${index}`}>End Date</Label>
													<Input
														id={`end-date-${index}`}
														type="month"
														value={exp.endDate}
														disabled={exp.currentJob}
														onChange={(e) => handleNestedChange("workExperiences", index, "endDate", e.target.value)}
														max={new Date().toISOString().slice(0, 7)}
														className={formErrors[`workExperiences[${index}].endDate`] ? "border-red-500" : ""}
													/>
													{formErrors[`workExperiences[${index}].endDate`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].endDate`]}</p>}
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
													className={formErrors[`workExperiences[${index}].description`] ? "border-red-500" : ""}
												/>
												{formErrors[`workExperiences[${index}].description`] && <p className="text-red-500 text-xs">{formErrors[`workExperiences[${index}].description`]}</p>}
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
										<h3 className="font-medium text-base sm:text-lg">Education</h3>
									</div>
									{formData.educations.map((edu, index) => (
										<div key={index} className="rounded-lg border p-4 space-y-4 relative">
											<div className="space-y-2">
												<Label htmlFor={`degree-${index}`}>Degree</Label>
												<Input
													id={`degree-${index}`}
													value={edu.degree}
													onChange={(e) => handleNestedChange("educations", index, "degree", e.target.value)}
													placeholder="e.g. Bachelor of Science in Computer Science"
													className={formErrors[`educations[${index}].degree`] ? "border-red-500" : ""}
												/>
												{formErrors[`educations[${index}].degree`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].degree`]}</p>}
											</div>
											<div className="space-y-2">
												<Label htmlFor={`institution-${index}`}>Institution</Label>
												<Input
													id={`institution-${index}`}
													value={edu.institution}
													onChange={(e) => handleNestedChange("educations", index, "institution", e.target.value)}
													placeholder="e.g. Stanford University"
													className={formErrors[`educations[${index}].institution`] ? "border-red-500" : ""}
												/>
												{formErrors[`educations[${index}].institution`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].institution`]}</p>}
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`edu-start-date-${index}`}>Start Year</Label>
													<Input
														id={`edu-start-date-${index}`}
														type="number"
														value={edu.startYear}
														onChange={(e) => handleNestedChange("educations", index, "startYear", e.target.value)}
														placeholder="e.g. 2015"
														min="1900"
														max={new Date().getFullYear()}
														className={formErrors[`educations[${index}].startYear`] ? "border-red-500" : ""}
													/>
													{formErrors[`educations[${index}].startYear`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].startYear`]}</p>}
												</div>
												<div className="space-y-2">
													<Label htmlFor={`edu-end-date-${index}`}>End Year</Label>
													<Input
														id={`edu-end-date-${index}`}
														type="number"
														value={edu.endYear}
														onChange={(e) => handleNestedChange("educations", index, "endYear", e.target.value)}
														placeholder="e.g. 2019"
														min="1900"
														max={new Date().getFullYear()}
														className={formErrors[`educations[${index}].endYear`] ? "border-red-500" : ""}
													/>
													{formErrors[`educations[${index}].endYear`] && <p className="text-red-500 text-xs">{formErrors[`educations[${index}].endYear`]}</p>}
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
										<h3 className="font-medium text-base sm:text-lg">Certifications</h3>
									</div>
									{formData.certifications.map((cert, index) => (
										<div key={index} className="rounded-lg border p-4 space-y-4 relative">
											<div className="space-y-2">
												<Label htmlFor={`certification-${index}`}>Certification Name</Label>
												<Input
													id={`certification-${index}`}
													value={cert.name}
													onChange={(e) => handleNestedChange("certifications", index, "name", e.target.value)}
													placeholder="e.g. AWS Certified Solutions Architect"
													className={formErrors[`certifications[${index}].name`] ? "border-red-500" : ""}
												/>
												{formErrors[`certifications[${index}].name`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].name`]}</p>}
											</div>
											<div className="space-y-2">
												<Label htmlFor={`issuing-org-${index}`}>Issuing Organization</Label>
												<Input
													id={`issuing-org-${index}`}
													value={cert.issuingOrg}
													onChange={(e) => handleNestedChange("certifications", index, "issuingOrg", e.target.value)}
													placeholder="e.g. Amazon Web Services"
													className={formErrors[`certifications[${index}].issuingOrg`] ? "border-red-500" : ""}
												/>
												{formErrors[`certifications[${index}].issuingOrg`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].issuingOrg`]}</p>}
											</div>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`issue-date-${index}`}>Issue Date</Label>
													<Input
														id={`issue-date-${index}`}
														type="month"
														value={cert.issueDate}
														onChange={(e) => handleNestedChange("certifications", index, "issueDate", e.target.value)}
														max={new Date().toISOString().slice(0, 7)}
														className={formErrors[`certifications[${index}].issueDate`] ? "border-red-500" : ""}
													/>
													{formErrors[`certifications[${index}].issueDate`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].issueDate`]}</p>}
												</div>
												<div className="space-y-2">
													<Label htmlFor={`expiry-date-${index}`}>Expiry Date (if applicable)</Label>
													<Input
														id={`expiry-date-${index}`}
														type="month"
														value={cert.expiryDate}
														onChange={(e) => handleNestedChange("certifications", index, "expiryDate", e.target.value)}
														className={formErrors[`certifications[${index}].expiryDate`] ? "border-red-500" : ""}
													/>
													{formErrors[`certifications[${index}].expiryDate`] && <p className="text-red-500 text-xs">{formErrors[`certifications[${index}].expiryDate`]}</p>}
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
							</div>
						)}

						{step === 4 && (
							<div className="space-y-6">
								<div className="space-y-4">
									<div className="space-y-2">
										<Label className="font-bold text-base sm:text-lg">Session Format</Label>
										<RadioGroup value={formData.sessionFormat} onValueChange={(value) => handleInputChange("sessionFormat", value)} className="space-y-2">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="one-on-one" id="one-on-one" />
												<Label htmlFor="one-on-one" className="font-normal text-sm sm:text-base">
													One-on-One Sessions Only
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="group" id="group" />
												<Label htmlFor="group" className="font-normal text-sm sm:text-base">
													Group Sessions Only
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="both" id="both" />
												<Label htmlFor="both" className="font-normal text-sm sm:text-base">
													Both One-on-One and Group Sessions
												</Label>
											</div>
										</RadioGroup>
										{formErrors.sessionFormat && <p className="text-red-500 text-xs">{formErrors.sessionFormat}</p>}
									</div>

									<div className="space-y-2">
										<Label className="font-bold text-base sm:text-lg">Session Type</Label>
										<div className="space-y-2">
											<div className="flex items-center space-x-2">
												<Checkbox id="video-calls" checked={formData.sessionTypes.includes("video-calls")} onCheckedChange={(checked) => handleArrayChange("sessionTypes", "video-calls", !!checked)} />
												<Label htmlFor="video-calls" className="font-normal text-sm sm:text-base">
													Video Calls
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox id="chat" checked={formData.sessionTypes.includes("chat")} onCheckedChange={(checked) => handleArrayChange("sessionTypes", "chat", !!checked)} />
												<Label htmlFor="chat" className="font-normal text-sm sm:text-base">
													Text Chat
												</Label>
											</div>
										</div>
										{formErrors.sessionTypes && <p className="text-red-500 text-xs">{formErrors.sessionTypes}</p>}
									</div>

									<Separator />

									<div className="space-y-2">
										<Label className="font-bold text-base sm:text-lg">Session Pricing</Label>
										<RadioGroup value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value)} className="space-y-2">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="free" id="free" />
												<Label htmlFor="free" className="font-normal text-sm sm:text-base">
													Free Sessions
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="paid" id="paid" />
												<Label htmlFor="paid" className="font-normal text-sm sm:text-base">
													Paid Sessions
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="both-pricing" id="both-pricing" />
												<Label htmlFor="both-pricing" className="font-normal text-sm sm:text-base">
													Both Free and Paid Sessions
												</Label>
											</div>
										</RadioGroup>
										{formErrors.pricing && <p className="text-red-500 text-xs">{formErrors.pricing}</p>}
									</div>

									<div className="space-y-2">
										<Label className="font-bold text-base sm:text-lg" htmlFor="hourly-rate">
											Hourly Rate (INR)
										</Label>
										<div className="relative">
											<IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="hourly-rate"
												className={`pl-9 ${formErrors.hourlyRate ? "border-red-500" : ""}`}
												value={formData.hourlyRate}
												onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
												placeholder="e.g. 150"
												type="number"
												min="0"
											/>
										</div>
										{formErrors.hourlyRate && <p className="text-red-500 text-xs">{formErrors.hourlyRate}</p>}
										<p className="text-xs text-muted-foreground">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
									</div>

									<Separator />

									<div className="space-y-2">
										<Label className="font-bold text-base sm:text-lg">Availability</Label>
										<div className="grid grid-cols-2 gap-2 sm:gap-4">
											{["weekdays", "weekends", "evenings", "always"].map((option) => (
												<div key={option} className="flex items-center space-x-2">
													<Checkbox id={option} checked={formData.availability.includes(option)} onCheckedChange={(checked) => handleArrayChange("availability", option, !!checked)} />
													<Label htmlFor={option} className="text-sm sm:text-base font-normal">
														{option.charAt(0).toUpperCase() + option.slice(1)}
													</Label>
												</div>
											))}
										</div>
										{formErrors.availability && <p className="text-red-500 text-xs">{formErrors.availability}</p>}
									</div>

									<div className="space-y-2">
										<Label htmlFor="hours-per-week">Hours Available Per Week</Label>
										<Input
											id="hours-per-week"
											type="number"
											value={formData.hoursPerWeek}
											onChange={(e) => handleInputChange("hoursPerWeek", e.target.value)}
											placeholder="e.g. 10"
											min="0"
											className={formErrors.hoursPerWeek ? "border-red-500" : ""}
										/>
										{formErrors.hoursPerWeek && <p className="text-red-500 text-xs">{formErrors.hoursPerWeek}</p>}
									</div>
								</div>
							</div>
						)}

						{step === 5 && (
							<div className="space-y-6">
								<div className="space-y-4">
									<div className="rounded-lg border border-dashed p-4 sm:p-6 text-center">
										<div className="flex flex-col items-center gap-2">
											<Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
											<h3 className="font-medium text-base sm:text-lg">Upload Supporting Documents</h3>
											<p className="text-xs sm:text-sm text-muted-foreground">Upload your resume, certifications, or any other documents that verify your expertise</p>
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
															<div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10">
																<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
															</div>
															<div>
																<p className="font-medium text-sm sm:text-base">{file.name}</p>
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
											{formData.documents.some((_, index) => formErrors[`documents[${index}]`]) && (
												<div className="space-y-1">
													{formData.documents.map((_, index) =>
														formErrors[`documents[${index}]`] ? (
															<p key={index} className="text-red-500 text-xs">
																{formErrors[`documents[${index}]`]}
															</p>
														) : null
													)}
												</div>
											)}
										</div>
									)}

									<Separator />

									<div className="space-y-2">
										<Label className="text-base sm:text-lg">Verification</Label>
										<div className="space-y-4">
											<div className="flex items-center space-x-2">
												<Checkbox id="terms" checked={formData.terms} onCheckedChange={(checked) => handleInputChange("terms", !!checked)} />
												<Label htmlFor="terms" className="text-sm sm:text-base font-normal">
													I confirm that all information provided is accurate and complete
												</Label>
											</div>
											{formErrors.terms && <p className="text-red-500 text-xs">{formErrors.terms}</p>}
											<div className="flex items-center space-x-2">
												<Checkbox id="guidelines" checked={formData.guidelines} onCheckedChange={(checked) => handleInputChange("guidelines", !!checked)} />
												<Label htmlFor="guidelines" className="text-sm sm:text-base font-normal">
													I have read and agree to the Mentor Guidelines and Code of Conduct
												</Label>
											</div>
											{formErrors.guidelines && <p className="text-red-500 text-xs">{formErrors.guidelines}</p>}
											<div className="flex items-center space-x-2">
												<Checkbox id="interview" checked={formData.interview} onCheckedChange={(checked) => handleInputChange("interview", !!checked)} />
												<Label htmlFor="interview" className="text-sm sm:text-base font-normal">
													I understand that I may be contacted for an interview as part of the verification process
												</Label>
											</div>
											{formErrors.interview && <p className="text-red-500 text-xs">{formErrors.interview}</p>}
										</div>
									</div>

									<div className="rounded-lg bg-muted p-4">
										<h3 className="font-medium text-base sm:text-lg mb-2">What happens next?</h3>
										<ol className="space-y-2 list-decimal list-inside text-xs sm:text-sm text-muted-foreground">
											<li>Our admin team will review your application</li>
											<li>You may be contacted for additional information or an interview</li>
											<li>You'll receive a notification once your application is approved or rejected</li>
											<li>If approved, you'll gain access to the mentor dashboard and can start accepting sessions</li>
										</ol>
									</div>
								</div>
							</div>
						)}
					</CardContent>
					<CardFooter className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
						{step > 1 ? (
							<Button variant="outline" onClick={handleBack} className="w-full sm:w-auto gap-2">
								<ArrowLeft className="h-4 w-4" />
								Back
							</Button>
						) : (
							<Button variant="outline" asChild className="w-full sm:w-auto gap-2">
								<Link to="/dashboard">
									<ArrowLeft className="h-4 w-4" />
									Cancel
								</Link>
							</Button>
						)}
						<Button onClick={handleNext} disabled={isLoading} className="w-full sm:w-auto gap-2">
							{isLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Submitting...
								</>
							) : step < totalSteps ? (
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

			<Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
				<DialogContent className="max-w-[90vw] sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Validation Errors</DialogTitle>
						<DialogDescription>Please fix the following issues to submit your application:</DialogDescription>
					</DialogHeader>
					<div className="max-h-[60vh] overflow-y-auto">
						<ul className="list-disc pl-5 space-y-2 text-sm text-red-600">
							{Object.values(formErrors).map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
					<DialogFooter>
						<Button onClick={() => setShowErrorModal(false)}>Close</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
