import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Camera, GraduationCap, BookOpen, Eye, FileText, IndianRupeeIcon, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMentor } from "@/hooks/useMentor";
import { toast } from "sonner";
import { extractDocumentName } from "@/utility/extractDocumentName";
import { fetchDocumentUrlsAPI } from "@/api/admin/common/fetchDocuments";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import MultipleSelector from "@/components/ui/multiple-selector";
import { SKILL_OPTIONS } from "@/constants/skill.option";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import axiosInstance from "@/api/config/api.config";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

// Updated schema to match BecomeMentorPage and add stricter validation
const mentorProfileSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name is too long"),
	lastName: z.string().max(50, "Last name is too long").optional(),
	professionalTitle: z.string().min(2, "Professional title must be at least 2 characters").max(100, "Professional title is too long"),
	bio: z.string().min(10, "Bio must be at least 10 characters").max(1000, "Bio is too long"),
	skills: z.array(z.string().min(1)).min(1, "At least one skill is required").max(20, "Maximum 20 skills allowed"),
	sessionFormat: z.enum(["one-on-one", "group", "both"], {
		errorMap: () => ({ message: "Invalid session format" }),
	}),
	primaryExpertise: z.string().min(2, "Primary expertise must be at least 2 characters").max(100, "Primary expertise is too long"),
	languages: z.array(z.string().min(1)).min(1, "At least one language is required").max(10, "Maximum 10 languages allowed"),
	hourlyRate: z.number().min(0, "Hourly rate cannot be negative").max(100000, "Hourly rate is too high"),
	pricing: z.enum(["free", "paid"], {
		errorMap: () => ({ message: "Invalid pricing option" }),
	}),
	yearsExperience: z.string().min(1, "Years of experience is required"),
	workExperiences: z
		.array(
			z.object({
				jobTitle: z.string().min(2, "Job title must be at least 2 characters").max(100),
				company: z.string().min(2, "Company must be at least 2 characters").max(100),
				startDate: z.string().min(1, "Start date is required"),
				endDate: z.string().nullable(),
				description: z.string().min(10, "Description must be at least 10 characters").max(1000),
				currentJob: z.boolean(),
			})
		)
		.min(1, "At least one work experience is required"),
	educations: z
		.array(
			z.object({
				degree: z.string().min(2, "Degree must be at least 2 characters").max(100),
				institution: z.string().min(2, "Institution must be at least 2 characters").max(100),
				startYear: z.string().regex(/^\d{4}$/, "Invalid start year"),
				endYear: z.string().regex(/^\d{4}$/, "Invalid end year"),
			})
		)
		.min(1, "At least one education is required"),
	certifications: z.array(
		z.object({
			name: z.string().min(2, "Certification name must be at least 2 characters").max(100),
			issuingOrg: z.string().min(2, "Issuing organization must be at least 2 characters").max(100),
			issueDate: z.string().min(1, "Issue date is required"),
			expiryDate: z.string().nullable(),
		})
	),
	avatar: z.instanceof(File).optional(),
	documents: z.array(z.instanceof(File)).optional(),
});

type FormData = z.infer<typeof mentorProfileSchema>;

export function MentorProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string | any>>>({});
	const [, setTimeArray] = useState<string[]>([]);
	const [selectedDocUrl, setSelectedDocUrl] = useState<string | null>(null);
	const [documentUrls, setDocumentUrls] = useState<string[]>([]);
	const [newDocuments, setNewDocuments] = useState<File[]>([]); // Track new documents
	const [isLoading, setIsLoading] = useState(false);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const { error, loading, mentor, refetchMentor } = useMentor(user?.id as string); // Added refetchMentor
	const navigate = useNavigate();

	console.log("formErrors: ", formErrors);
	// Initialize form data
	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		professionalTitle: "",
		bio: "",
		skills: [],
		sessionFormat: "one-on-one",
		primaryExpertise: "",
		languages: [],
		hourlyRate: 0,
		pricing: "free",
		yearsExperience: "1-2",
		workExperiences: [{ jobTitle: "", company: "", startDate: "", endDate: null, currentJob: false, description: "" }],
		educations: [{ degree: "", institution: "", startYear: "", endYear: "" }],
		certifications: [],
		documents: [],
	});

	// Populate form data with mentor data
	useEffect(() => {
		if (mentor) {
			setFormData({
				firstName: mentor.firstName || "",
				lastName: mentor.lastName || "",
				professionalTitle: mentor.professionalTitle || "",
				bio: mentor.bio || "",
				skills: mentor.skills || [],
				sessionFormat: mentor.sessionFormat || "one-on-one",
				primaryExpertise: mentor.primaryExpertise || "",
				languages: mentor.languages || [],
				hourlyRate: mentor.hourlyRate || 0,
				pricing: mentor.pricing || "free",
				yearsExperience: mentor.yearsExperience || "",
				workExperiences: Array.isArray(mentor.workExperiences)
					? mentor.workExperiences.map((exp) => ({
							jobTitle: exp.jobTitle || "",
							company: exp.company || "",
							startDate: exp.startDate || "",
							endDate: exp.endDate || null,
							description: exp.description || "",
							currentJob: exp.currentJob || !exp.endDate,
					  }))
					: [{ jobTitle: "", company: "", startDate: "", endDate: null, currentJob: false, description: "" }],
				educations:
					mentor.educations?.length > 0
						? mentor.educations.map((edu) => ({
								degree: edu.degree || "",
								institution: edu.institution || "",
								startYear: edu.startYear || "",
								endYear: edu.endYear || "",
						  }))
						: [{ degree: "", institution: "", startYear: "", endYear: "" }],
				certifications:
					mentor.certifications?.length > 0
						? mentor.certifications.map((cert) => ({
								name: cert.name || "",
								issuingOrg: cert.issuingOrg || "",
								issueDate: cert.issueDate || "",
								expiryDate: cert.expiryDate || null,
						  }))
						: [],
				documents: [],
			});
		}
	}, [mentor]);

	// Fetch documents
	useEffect(() => {
		if (!user?.id) return;
		const fetchDocumentUrls = async () => {
			try {
				const response = await fetchDocumentUrlsAPI(user.id!);
				if (response.success) {
					setDocumentUrls(response.documents);
				}
			} catch (error) {
				console.error("Error fetching document URLs:", error);
				toast.error("Failed to load documents. Please try again.");
			}
		};
		fetchDocumentUrls();
	}, [user?.id]);

	// Generate time slots
	useEffect(() => {
		const timeSlots: string[] = [];
		for (let hour = 0; hour < 24; hour++) {
			for (let min = 0; min < 60; min += 30) {
				const formattedHour = hour.toString().padStart(2, "0");
				const formattedMin = min.toString().padStart(2, "0");
				timeSlots.push(`${formattedHour}:${formattedMin}`);
			}
		}
		setTimeArray(timeSlots);
	}, []);

	// Handle error toast
	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	// Handle input changes with sanitization
	const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
		let sanitizedValue = value;
		if (typeof value === "string") {
			sanitizedValue = value as any;
		}
		setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
		setFormErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	// Handle array field changes
	const handleArrayChange = (field: "languages" | "skills", value: string, add: boolean) => {
		const sanitizedValue = value;
		setFormData((prev) => ({
			...prev,
			[field]: add ? [...prev[field], sanitizedValue] : prev[field].filter((item: string) => item !== sanitizedValue),
		}));
		setFormErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	// Handle nested field changes
	const handleNestedChange = (field: "workExperiences" | "educations" | "certifications", index: number, subField: string, value: any) => {
		const sanitizedValue = typeof value === "string" ? value : value;
		setFormData((prev) => {
			const updated = [...(prev[field] as any[])];
			updated[index] = { ...updated[index], [subField]: sanitizedValue };
			return { ...prev, [field]: updated };
		});
		setFormErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	// Handle avatar upload
	const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			if (files[0].size > 5 * 1024 * 1024) {
				toast.error("Avatar file size must be less than 5MB");
				return;
			}
			if (!files[0].type.startsWith("image/")) {
				toast.error("Only image files are allowed");
				return;
			}
			handleInputChange("avatar", files[0]);
		}
	};

	// Handle document upload
	const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const newDocs = Array.from(files).filter((file) => {
				if (file.size > 10 * 1024 * 1024) {
					toast.error(`${file.name} is too large. Maximum size is 10MB`);
					return false;
				}
				if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
					toast.error(`${file.name} is not a valid file type. Only PDF and Word documents are allowed`);
					return false;
				}
				return true;
			});
			setNewDocuments((prev) => [...prev, ...newDocs]);
			handleInputChange("documents", [...(formData.documents || []), ...newDocs]);
			toast.success(`${newDocs.length} document${newDocs.length > 1 ? "s" : ""} added successfully`);
		}
	};

	// Handle skill removal
	const handleRemoveSkill = (skill: string) => {
		handleArrayChange("skills", skill, false);
	};

	// Handle work experience addition/removal
	const handleAddWorkExperience = () => {
		handleInputChange("workExperiences", [
			...formData.workExperiences,
			{
				jobTitle: "",
				company: "",
				startDate: "",
				endDate: null,
				description: "",
				currentJob: false,
			},
		]);
	};

	const handleRemoveWorkExperience = (index: number) => {
		handleInputChange(
			"workExperiences",
			formData.workExperiences.filter((_, i) => i !== index)
		);
	};

	// Handle education addition/removal
	const handleAddEducation = () => {
		handleInputChange("educations", [
			...formData.educations,
			{
				degree: "",
				institution: "",
				startYear: "",
				endYear: "",
			},
		]);
	};

	const handleRemoveEducation = (index: number) => {
		handleInputChange(
			"educations",
			formData.educations.filter((_, i) => i !== index)
		);
	};

	// Handle certification addition/removal
	const handleAddCertification = () => {
		handleInputChange("certifications", [
			...formData.certifications,
			{
				name: "",
				issuingOrg: "",
				issueDate: "",
				expiryDate: null,
			},
		]);
	};

	const handleRemoveCertification = (index: number) => {
		handleInputChange(
			"certifications",
			formData.certifications.filter((_, i) => i !== index)
		);
	};

	// Handle document removal
	const handleRemoveNewDocument = (index: number) => {
		const updatedNewDocs = newDocuments.filter((_, i) => i !== index);
		setNewDocuments(updatedNewDocs);
		handleInputChange("documents", updatedNewDocs);
	};

	// Handle form submission
	const handleSubmit = async () => {
		const userId = user?.id;
		if (!userId) {
			toast.error("User ID is missing. Please log in and try again.");
			navigate("/authenticate");
			return;
		}

		try {
			const validationResult = mentorProfileSchema.safeParse(formData);
			if (!validationResult.success) {
				const errors = validationResult.error.flatten().fieldErrors;
				setFormErrors(errors);
				toast.error("Please fix the validation errors and try again.");
				return;
			}
		} catch (validationError) {
			console.error("Validation error:", validationError);
			toast.error("Form validation failed. Please check your inputs.");
			return;
		}

		setIsLoading(true);

		try {
			const submissionData = new FormData();
			submissionData.append("userId", userId);
			submissionData.append("firstName", formData.firstName);
			submissionData.append("lastName", formData.lastName ?? "");
			submissionData.append("bio", formData.bio);
			submissionData.append("professionalTitle", formData.professionalTitle);
			submissionData.append("primaryExpertise", formData.primaryExpertise);
			submissionData.append("yearsExperience", formData.yearsExperience);
			submissionData.append("sessionFormat", formData.sessionFormat);
			submissionData.append("pricing", formData.pricing);
			submissionData.append("hourlyRate", formData.hourlyRate.toString());
			submissionData.append("languages", JSON.stringify(formData.languages));
			submissionData.append("skills", JSON.stringify(formData.skills));
			submissionData.append("workExperiences", JSON.stringify(formData.workExperiences));
			submissionData.append("educations", JSON.stringify(formData.educations));
			submissionData.append("certifications", JSON.stringify(formData.certifications));

			if (formData.avatar) {
				submissionData.append("avatar", formData.avatar);
			}

			if (formData.documents && formData.documents.length > 0) {
				formData.documents.forEach((file) => {
					submissionData.append("documents", file);
				});
			}

			const response = await axiosInstance.put(`/mentor/profile/edit/${userId}`, submissionData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data.success) {
				toast.success(response.data.message);
				setIsEditing(false);
				setNewDocuments([]); // Clear new documents after successful submission
				await refetchMentor(user.id!); // Refetch mentor data to update the profile
				const docResponse = await fetchDocumentUrlsAPI(userId); // Refresh document URLs
				if (docResponse.success) {
					setDocumentUrls(docResponse.documents);
				}
			} else {
				toast.error(response.data.message || "Failed to update profile");
			}
		} catch (error) {
			console.error("Submission error:", error);
			const errorMessage = error instanceof AxiosError && error.response?.data?.message ? error.response.data.message : "An error occurred while updating your profile. Please try again.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle document view
	const handleViewDocument = async (url: string) => {
		setSelectedDocUrl(url);
	};

	// Handle document preview close
	const handleClosePreview = () => {
		setSelectedDocUrl(null);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="w-full p-4">
			<div className="">
				<div className="mb-8 flex items-center gap-2">
					<div className="flex-1">
						<h1 className="text-3xl font-bold tracking-tight">Mentor Profile</h1>
						<p className="text-muted-foreground">Manage how you appear to potential mentees</p>
					</div>
					{isEditing && (
						<Button onClick={handleSubmit} disabled={isLoading}>
							{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
							Save Changes
						</Button>
					)}
					<Button onClick={() => setIsEditing(!isEditing)} disabled={isLoading} variant={isEditing ? "outline" : "default"}>
						{isEditing ? "Cancel Editing" : "Edit Profile"}
					</Button>
				</div>

				{/* Profile Header */}
				<Card className="mb-8">
					<CardContent className="p-6">
						<div className="flex flex-col justify-center items-center md:flex-row md:items-center gap-6">
							<div className="relative">
								<Avatar className="h-24 w-24 border-4 border-primary/20">
									<AvatarImage src={formData.avatar ? URL.createObjectURL(formData.avatar) : mentor.avatar || "/placeholder.svg"} alt={`${formData.firstName} ${formData.lastName}`} />
									<AvatarFallback>
										{formData.firstName.charAt(0)}
										{formData.lastName?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								{isEditing && (
									<Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" asChild disabled={isLoading}>
										<label>
											<input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
											<Camera className="h-4 w-4" />
											<span className="sr-only">Change profile picture</span>
										</label>
									</Button>
								)}
							</div>
							<div className="flex-1">
								{isEditing ? (
									<div className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="first-name">First Name</Label>
												<Input id="first-name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} disabled={isLoading} />
												{formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
											</div>
											<div className="space-y-2">
												<Label htmlFor="last-name">Last Name</Label>
												<Input id="last-name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} disabled={isLoading} />
												{formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
											</div>
										</div>
										<div className="space-y-2">
											<Label htmlFor="professional-title">Professional Title</Label>
											<Input id="professional-title" value={formData.professionalTitle} onChange={(e) => handleInputChange("professionalTitle", e.target.value)} disabled={isLoading} />
											{formErrors.professionalTitle && <p className="text-sm text-red-500">{formErrors.professionalTitle}</p>}
										</div>
									</div>
								) : (
									<>
										<h2 className="text-2xl font-bold">
											{formData.firstName} {formData.lastName}
										</h2>
										<p className="text-lg text-muted-foreground">{formData.professionalTitle}</p>
									</>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<div className="mt-1 flex flex-col gap-4">
									<div className="flex items-center gap-1">
										<Badge variant="outline" className="text-sm">
											{mentor.averageRating?.toFixed(1) || "N/A"} ⭐
										</Badge>
										<span className="text-sm text-muted-foreground">({mentor.totalReviews || 0} reviews)</span>
									</div>
									<span className="text-sm text-muted-foreground">{mentor.sessionCompleted || 0} sessions completed</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Main Content */}
				<Tabs defaultValue="about" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="about">About</TabsTrigger>
						<TabsTrigger value="experience">Experience</TabsTrigger>
						<TabsTrigger value="preferences">Preferences</TabsTrigger>
					</TabsList>

					{/* About Tab */}
					<TabsContent value="about" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Professional Bio</CardTitle>
								<CardDescription>Tell potential mentees about yourself and your expertise</CardDescription>
							</CardHeader>
							<CardContent>
								{isEditing ? (
									<>
										<Textarea className="min-h-[200px]" value={formData.bio} onChange={(e) => handleInputChange("bio", e.target.value)} placeholder="Write about your experience and expertise..." disabled={isLoading} />
										{formErrors.bio && <p className="text-sm text-red-500">{formErrors.bio}</p>}
									</>
								) : (
									<p className="leading-relaxed">{formData.bio || "No bio provided."}</p>
								)}
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<CardTitle>Skills & Expertise</CardTitle>
								<CardDescription>Add skills that you can mentor others in</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex flex-wrap gap-2">
										{formData.skills.length > 0 ? (
											formData.skills.map((skill) => (
												<Badge key={skill} variant="secondary" className={isEditing ? "gap-1 px-3 py-1" : ""}>
													{skill}
													{isEditing && (
														<button onClick={() => handleRemoveSkill(skill)} className="ml-1 rounded-full hover:bg-muted" disabled={isLoading}>
															<X className="h-3 w-3" />
															<span className="sr-only">Remove {skill}</span>
														</button>
													)}
												</Badge>
											))
										) : (
											<p className="text-sm text-muted-foreground">No skills added yet.</p>
										)}
										{formErrors.skills && <p className="text-sm text-red-500">{formErrors.skills}</p>}
									</div>

									{isEditing && (
										<div className="space-y-2">
											<Label>Skills</Label>
											<MultipleSelector
												value={formData.skills.map((skill: string) => ({ label: skill, value: skill }))}
												onChange={(options) => handleArrayChange("skills", options.map((opt) => opt.value).join(", "), true)}
												defaultOptions={SKILL_OPTIONS}
												placeholder="Select or type skills..."
												creatable
												emptyIndicator={<p className="text-center text-sm text-gray-500">No matching skills found.</p>}
												className="w-full"
												disabled={isLoading}
											/>
											<p className="text-xs text-gray-500">Add specific skills like 'JavaScript', 'React', 'Data Analysis', etc.</p>
										</div>
									)}
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
								</div>
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<CardTitle>Mentoring Preferences</CardTitle>
								<CardDescription>Your preferred mentoring style and approach</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{isEditing ? (
										<>
											<div className="space-y-2">
												<Label htmlFor="mentoring-style">Mentoring Style</Label>
												<Select value={formData.sessionFormat} onValueChange={(value) => handleInputChange("sessionFormat", value as "one-on-one" | "group" | "both")} disabled={isLoading}>
													<SelectTrigger id="mentoring-style">
														<SelectValue placeholder="Select style" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="one-on-one">One-on-One</SelectItem>
														<SelectItem value="group">Group</SelectItem>
														<SelectItem value="both">Both</SelectItem>
													</SelectContent>
												</Select>
												{formErrors.sessionFormat && <p className="text-sm text-red-500">{formErrors.sessionFormat}</p>}
											</div>
											<div className="space-y-2">
												<Label htmlFor="primary-expertise">Primary Expertise</Label>
												<Input id="primary-expertise" value={formData.primaryExpertise} onChange={(e) => handleInputChange("primaryExpertise", e.target.value)} disabled={isLoading} />
												{formErrors.primaryExpertise && <p className="text-sm text-red-500">{formErrors.primaryExpertise}</p>}
											</div>

											<div className="space-y-2">
												<Label>Languages Spoken</Label>
												<div className="flex flex-wrap gap-4">
													{["English", "Malayalam", "Hindi", "French", "Spanish", "Tamil", "Telugu", "Kannada"].map((lang) => (
														<div key={lang} className="flex items-center space-x-2">
															<Checkbox id={`lang-${lang}`} checked={formData.languages.includes(lang)} onCheckedChange={(checked) => handleArrayChange("languages", lang, !!checked)} disabled={isLoading} />
															<Label htmlFor={`lang-${lang}`} className="font-normal">
																{lang}
															</Label>
														</div>
													))}
												</div>
												{formErrors.languages && <p className="text-sm text-red-500">{formErrors.languages}</p>}
												<p className="text-xs text-gray-500 mt-3">Select all languages you speak fluently.</p>
											</div>
										</>
									) : (
										<div className="grid gap-4 md:grid-cols-2">
											<div className="rounded-lg border p-4">
												<h3 className="font-medium">Mentoring Style</h3>
												<p className="text-sm text-muted-foreground">{formData.sessionFormat === "one-on-one" ? "One-on-One" : formData.sessionFormat === "group" ? "Group" : "Both"}</p>
											</div>
											<div className="rounded-lg border p-4">
												<h3 className="font-medium">Primary Expertise</h3>
												<p className="text-sm text-muted-foreground">{formData.primaryExpertise}</p>
											</div>
											<div className="rounded-lg border p-4">
												<h3 className="font-medium">Languages</h3>
												<p className="text-sm text-muted-foreground">{formData.languages.join(", ") || "No languages specified"}</p>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Experience Tab */}
					<TabsContent value="experience" className="mt-6">
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Work Experience</CardTitle>
										<CardDescription>Your professional background and experience</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm" onClick={handleAddWorkExperience} disabled={isLoading}>
											<Plus className="mr-2 h-4 w-4" />
											Add Experience
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{formData.workExperiences.map((work, index) => (
										<div key={index} className="relative border-l-2 border-muted pl-6">
											<div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`}></div>
											<div>
												{isEditing ? (
													<div className="space-y-4">
														<div className="space-y-2">
															<Label htmlFor={`job-title-${index}`}>Job Title</Label>
															<Input id={`job-title-${index}`} value={work.jobTitle} onChange={(e) => handleNestedChange("workExperiences", index, "jobTitle", e.target.value)} disabled={isLoading} />
															{formErrors.workExperiences?.[index]?.jobTitle && <p className="text-sm text-red-500">{formErrors.workExperiences[index].jobTitle}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`company-${index}`}>Company</Label>
															<Input id={`company-${index}`} value={work.company} onChange={(e) => handleNestedChange("workExperiences", index, "company", e.target.value)} disabled={isLoading} />
															{formErrors.workExperiences?.[index]?.company && <p className="text-sm text-red-500">{formErrors.workExperiences[index].company}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`start-date-${index}`}>Start Date</Label>
															<Input id={`start-date-${index}`} value={work.startDate} onChange={(e) => handleNestedChange("workExperiences", index, "startDate", e.target.value)} disabled={isLoading} />
															{formErrors.workExperiences?.[index]?.startDate && <p className="text-sm text-red-500">{formErrors.workExperiences[index].startDate}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`end-date-${index}`}>End Date (leave blank if current)</Label>
															<Input id={`end-date-${index}`} value={work.endDate || ""} onChange={(e) => handleNestedChange("workExperiences", index, "endDate", e.target.value || null)} disabled={isLoading} />
															{formErrors.workExperiences?.[index]?.endDate && <p className="text-sm text-red-500">{formErrors.workExperiences[index].endDate}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`description-${index}`}>Description</Label>
															<Textarea id={`description-${index}`} value={work.description} onChange={(e) => handleNestedChange("workExperiences", index, "description", e.target.value)} disabled={isLoading} />
															{formErrors.workExperiences?.[index]?.description && <p className="text-sm text-red-500">{formErrors.workExperiences[index].description}</p>}
														</div>
														<div className="flex justify-end">
															<Button variant="outline" size="sm" onClick={() => handleRemoveWorkExperience(index)} disabled={isLoading}>
																Remove
															</Button>
														</div>
													</div>
												) : (
													<>
														<h3 className="font-bold">{work.jobTitle}</h3>
														<p className="text-sm text-muted-foreground">
															{work.company} • {work.startDate} - {work.endDate || "Present"}
														</p>
														<p className="mt-2">{work.description}</p>
													</>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Education</CardTitle>
										<CardDescription>Your educational background</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm" onClick={handleAddEducation} disabled={isLoading}>
											<Plus className="mr-2 h-4 w-4" />
											Add Education
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{formData.educations.map((edu, index) => (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<GraduationCap className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1">
												{isEditing ? (
													<div className="space-y-4">
														<div className="space-y-2">
															<Label htmlFor={`degree-${index}`}>Degree</Label>
															<Input id={`degree-${index}`} value={edu.degree} onChange={(e) => handleNestedChange("educations", index, "degree", e.target.value)} disabled={isLoading} />
															{formErrors.educations?.[index]?.degree && <p className="text-sm text-red-500">{formErrors.educations[index].degree}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`institution-${index}`}>Institution</Label>
															<Input id={`institution-${index}`} value={edu.institution} onChange={(e) => handleNestedChange("educations", index, "institution", e.target.value)} disabled={isLoading} />
															{formErrors.educations?.[index]?.institution && <p className="text-sm text-red-500">{formErrors.educations[index].institution}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`start-year-${index}`}>Start Year</Label>
															<Input id={`start-year-${index}`} value={edu.startYear} onChange={(e) => handleNestedChange("educations", index, "startYear", e.target.value)} disabled={isLoading} />
															{formErrors.educations?.[index]?.startYear && <p className="text-sm text-red-500">{formErrors.educations[index].startYear}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`end-year-${index}`}>End Year</Label>
															<Input id={`end-year-${index}`} value={edu.endYear} onChange={(e) => handleNestedChange("educations", index, "endYear", e.target.value)} disabled={isLoading} />
															{formErrors.educations?.[index]?.endYear && <p className="text-sm text-red-500">{formErrors.educations[index].endYear}</p>}
														</div>
														<div className="flex justify-end">
															<Button variant="outline" size="sm" onClick={() => handleRemoveEducation(index)} disabled={isLoading}>
																Remove
															</Button>
														</div>
													</div>
												) : (
													<>
														<h3 className="font-medium">{edu.degree}</h3>
														<p className="text-sm text-muted-foreground">
															{edu.institution} • {edu.startYear} - {edu.endYear}
														</p>
													</>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Certifications</CardTitle>
										<CardDescription>Your professional certifications</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm" onClick={handleAddCertification} disabled={isLoading}>
											<Plus className="mr-2 h-4 w-4" />
											Add Certification
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									{formData.certifications.map((cert, index) => (
										<div key={index} className="flex items-start gap-4">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<BookOpen className="h-5 w-5 text-primary" />
											</div>
											<div className="flex-1">
												{isEditing ? (
													<div className="space-y-4">
														<div className="space-y-2">
															<Label htmlFor={`cert-name-${index}`}>Certification Name</Label>
															<Input id={`cert-name-${index}`} value={cert.name} onChange={(e) => handleNestedChange("certifications", index, "name", e.target.value)} disabled={isLoading} />
															{formErrors.certifications?.[index]?.name && <p className="text-sm text-red-500">{formErrors.certifications[index].name}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`issuer-${index}`}>Issuing Organization</Label>
															<Input id={`issuer-${index}`} value={cert.issuingOrg} onChange={(e) => handleNestedChange("certifications", index, "issuingOrg", e.target.value)} disabled={isLoading} />
															{formErrors.certifications?.[index]?.issuingOrg && <p className="text-sm text-red-500">{formErrors.certifications[index].issuingOrg}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`year-${index}`}>Issue Date</Label>
															<Input id={`year-${index}`} value={cert.issueDate} onChange={(e) => handleNestedChange("certifications", index, "issueDate", e.target.value)} disabled={isLoading} />
															{formErrors.certifications?.[index]?.issueDate && <p className="text-sm text-red-500">{formErrors.certifications[index].issueDate}</p>}
														</div>
														<div className="space-y-2">
															<Label htmlFor={`expiry-${index}`}>Expiry Date (optional)</Label>
															<Input id={`expiry-${index}`} value={cert.expiryDate || ""} onChange={(e) => handleNestedChange("certifications", index, "expiryDate", e.target.value || null)} disabled={isLoading} />
															{formErrors.certifications?.[index]?.expiryDate && <p className="text-sm text-red-500">{formErrors.certifications[index].expiryDate}</p>}
														</div>
														<div className="flex justify-end">
															<Button variant="outline" size="sm" onClick={() => handleRemoveCertification(index)} disabled={isLoading}>
																Remove
															</Button>
														</div>
													</div>
												) : (
													<>
														<h3 className="font-medium">{cert.name}</h3>
														<p className="text-sm text-muted-foreground">
															{cert.issuingOrg} • {cert.issueDate} {cert.expiryDate ? ` - ${cert.expiryDate}` : ""}
														</p>
													</>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className="mt-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle>Documents</CardTitle>
										<CardDescription>Documents that prove your qualifications</CardDescription>
									</div>
									{isEditing && (
										<Button size="sm" asChild disabled={isLoading}>
											<label>
												<input type="file" className="hidden" onChange={handleDocumentUpload} accept=".pdf,.doc,.docx" multiple />
												<Plus className="mr-2 h-4 w-4" />
												Add Document
											</label>
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{isEditing && newDocuments.length > 0 && (
										<div className="mb-4">
											<h4 className="font-medium mb-2">Newly Added Documents</h4>
											<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
												{newDocuments.map((doc, index) => (
													<div key={index} className="flex items-center justify-between p-4 bg-background rounded-md border border-muted">
														<div className="flex items-center">
															<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
																<FileText className="h-5 w-5 text-primary" />
															</div>
															<div className="flex-1 truncate ml-3">{doc.name}</div>
														</div>
														<Button variant="outline" size="sm" onClick={() => handleRemoveNewDocument(index)} disabled={isLoading}>
															<X className="h-4 w-4" />
															Remove
														</Button>
													</div>
												))}
											</div>
										</div>
									)}
									{mentor.documents.length > 0 || documentUrls.length > 0 ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											{documentUrls.map((url, index) => (
												<div key={index} className="flex items-center justify-between p-4 bg-background rounded-md border border-muted">
													<div className="flex items-center">
														<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
															<FileText className="h-5 w-5 text-primary" />
														</div>
														<div className="flex-1 truncate ml-3">{extractDocumentName(url)}</div>
													</div>
													<Dialog open={selectedDocUrl === url} onOpenChange={(open) => !open && handleClosePreview()}>
														<DialogTrigger asChild>
															<Button variant="outline" size="sm" onClick={() => handleViewDocument(url)} disabled={isLoading}>
																<Eye className="mr-2 h-4 w-4" />
																View
															</Button>
														</DialogTrigger>
														<DialogContent className="sm:max-w-lg md:max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-background rounded-lg border">
															<DialogHeader className="pb-4">
																<DialogTitle>{extractDocumentName(url)}</DialogTitle>
																<DialogDescription>Preview the selected document</DialogDescription>
															</DialogHeader>
															<div className="relative bg-muted/10 p-4 rounded-lg">
																<Button variant="outline" size="sm" onClick={handleClosePreview} className="absolute top-2 right-2" disabled={isLoading}>
																	<X className="h-4 w-4" />
																	Close Preview
																</Button>
																<iframe src={selectedDocUrl!} title="Document Viewer" width="100%" height="700px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} />
															</div>
															<DialogFooter className="pt-4">
																<Button variant="outline" onClick={handleClosePreview} disabled={isLoading}>
																	Close
																</Button>
															</DialogFooter>
														</DialogContent>
													</Dialog>
												</div>
											))}
										</div>
									) : (
										<p className="text-sm text-muted-foreground italic">No documents available</p>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Preferences Tab */}
					<TabsContent value="preferences" className="mt-6">
						<Card>
							<CardHeader>
								<CardTitle>Session Preferences</CardTitle>
								<CardDescription>Configure your mentoring session preferences</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{isEditing ? (
									<>
										<div className="space-y-2">
											<Label className="font-bold">Session Pricing</Label>
											<RadioGroup value={formData.pricing} onValueChange={(value) => handleInputChange("pricing", value as "free" | "paid")} disabled={isLoading}>
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
											{formErrors.pricing && <p className="text-sm text-red-500">{formErrors.pricing}</p>}
										</div>

										{formData.pricing === "paid" && (
											<div className="space-y-2">
												<Label className="font-bold" htmlFor="hourly-rate">
													Hourly Rate (INR)
												</Label>
												<div className="relative">
													<IndianRupeeIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
													<Input id="hourly-rate" className="pl-9" value={formData.hourlyRate} onChange={(e) => handleInputChange("hourlyRate", Number(e.target.value))} placeholder="e.g. 150" type="number" disabled={isLoading} />
													{formErrors.hourlyRate && <p className="text-sm text-red-500">{formErrors.hourlyRate}</p>}
												</div>
												<p className="text-xs text-gray-500">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
											</div>
										)}
									</>
								) : (
									<div className="grid gap-4">
										<div className="rounded-lg border p-4">
											<h3 className="font-medium">Session Pricing</h3>
											<p className="text-sm text-muted-foreground">{formData.pricing === "free" ? "Free Sessions" : "Paid Sessions"}</p>
										</div>
										{formData.pricing === "paid" && (
											<div className="rounded-lg border p-4">
												<h3 className="font-medium">Hourly Rate</h3>
												<p className="text-sm text-muted-foreground flex items-center">
													<IndianRupeeIcon className="h-4 w-4 mr-1" />
													{formData.hourlyRate} / hour
												</p>
											</div>
										)}
									</div>
								)}
							</CardContent>
							{/* {isEditing && (
								<CardFooter>
									<Button onClick={handleSubmit} disabled={isLoading}>
										{isLoading ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Saving...
											</>
										) : (
											"Save Settings"
										)}
									</Button>
								</CardFooter>
							)} */}
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
