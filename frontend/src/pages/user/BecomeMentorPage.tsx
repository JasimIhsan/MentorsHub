import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, BriefcaseBusiness, GraduationCap, Upload, Plus, X, CheckCircle2, ArrowRight, ArrowLeft, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { SKILL_OPTIONS } from "@/data/skill.option";
import MultipleSelector from "@/components/ui/multiple-selector";

export function BecomeMentorPage() {
	const [step, setStep] = useState(1);
	const [skills, setSkills] = useState<string[]>([]);
	const [newSkill, setNewSkill] = useState("");
	const [documents, setDocuments] = useState<{ name: string; size: string }[]>([]);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [workExperiences, setWorkExperiences] = useState([{ jobTitle: "", company: "", startDate: "", endDate: "", currentJob: false, description: "" }]);
	const [educations, setEducations] = useState([{ degree: "", institution: "", startYear: "", endYear: "" }]);
	const [certifications, setCertifications] = useState([{ name: "", issuingOrg: "", issueDate: "", expiryDate: "" }]);

	const totalSteps = 5;
	const progress = (step / totalSteps) * 100;

	const handleAddSkill = () => {
		if (newSkill && !skills.includes(newSkill)) {
			setSkills([...skills, newSkill]);
			setNewSkill("");
		}
	};

	const handleRemoveSkill = (skill: string) => {
		setSkills(skills.filter((s) => s !== skill));
	};

	const handleAddDocument = () => {
		// In a real app, this would handle file uploads
		const mockDocuments = [
			{ name: "resume.pdf", size: "2.4 MB" },
			{ name: "certification.pdf", size: "1.8 MB" },
			{ name: "portfolio.pdf", size: "5.2 MB" },
		];

		// Add a mock document that's not already in the list
		const availableDocs = mockDocuments.filter((doc) => !documents.some((d) => d.name === doc.name));

		if (availableDocs.length > 0) {
			setDocuments([...documents, availableDocs[0]]);
		}
	};

	const handleRemoveDocument = (docName: string) => {
		setDocuments(documents.filter((doc) => doc.name !== docName));
	};

	const handleNext = () => {
		if (step < totalSteps) {
			setStep(step + 1);
			window.scrollTo(0, 0);
		} else {
			setIsSubmitted(true);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
			window.scrollTo(0, 0);
		}
	};

	// Handlers for Work Experience
	const handleAddWorkExperience = () => {
		setWorkExperiences([...workExperiences, { jobTitle: "", company: "", startDate: "", endDate: "", currentJob: false, description: "" }]);
	};

	const handleRemoveWorkExperience = (index: number) => {
		setWorkExperiences(workExperiences.filter((_, i) => i !== index));
	};

	const handleWorkExperienceChange = (index: number, field: string, value: string | boolean) => {
		const updatedExperiences = [...workExperiences];
		updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
		setWorkExperiences(updatedExperiences);
	};

	// Handlers for Education
	const handleAddEducation = () => {
		setEducations([...educations, { degree: "", institution: "", startYear: "", endYear: "" }]);
	};

	const handleRemoveEducation = (index: number) => {
		setEducations(educations.filter((_, i) => i !== index));
	};

	const handleEducationChange = (index: number, field: string, value: string) => {
		const updatedEducations = [...educations];
		updatedEducations[index] = { ...updatedEducations[index], [field]: value };
		setEducations(updatedEducations);
	};

	// Handlers for Certifications
	const handleAddCertification = () => {
		setCertifications([...certifications, { name: "", issuingOrg: "", issueDate: "", expiryDate: "" }]);
	};

	const handleRemoveCertification = (index: number) => {
		setCertifications(certifications.filter((_, i) => i !== index));
	};

	const handleCertificationChange = (index: number, field: string, value: string) => {
		const updatedCertifications = [...certifications];
		updatedCertifications[index] = { ...updatedCertifications[index], [field]: value };
		setCertifications(updatedCertifications);
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
		<div className="container py-8">
			<div className="mx-auto max-w-3xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Become a Mentor</h1>
					<p className="text-muted-foreground">Share your expertise and help others grow</p>
				</div>

				{/* Progress Bar */}
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
						{/* Step 1: Personal Information */}
						{step === 1 && (
							<>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="first-name">First Name</Label>
										<Input id="first-name" defaultValue="John" />
									</div>
									<div className="space-y-2">
										<Label htmlFor="last-name">Last Name</Label>
										<Input id="last-name" defaultValue="Doe" />
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="professional-title">Professional Title</Label>
									<Input id="professional-title" placeholder="e.g. Senior Software Engineer" />
								</div>

								<div className="space-y-2">
									<Label htmlFor="bio">Professional Bio</Label>
									<Textarea id="bio" placeholder="Tell us about yourself, your expertise, and why you want to be a mentor..." className="min-h-[150px]" />
									<p className="text-xs text-muted-foreground">This will be displayed on your mentor profile.</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="languages">Languages Spoken</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Select languages" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="English">English</SelectItem>
											<SelectItem value="Malayalam">Malayalam</SelectItem>
											<SelectItem value="Hindi">Hindi</SelectItem>
											<SelectItem value="Tamil">Tamil</SelectItem>
											<SelectItem value="Telugu">Telugu</SelectItem>
											<SelectItem value="Kannada">Kannada</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">You can select multiple languages.</p>
								</div>
							</>
						)}

						{/* Step 2: Expertise & Skills */}
						{step === 2 && (
							<>
								<div className="space-y-2">
									<Label htmlFor="expertise">Primary Area of Expertise</Label>
									<Select>
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
									<div className="flex flex-wrap gap-2 mb-2">
										{skills.map((skill) => (
											<Badge key={skill} variant="secondary" className="gap-1 px-3 py-1">
												{skill}
												<button onClick={() => handleRemoveSkill(skill)} className="ml-1 rounded-full hover:bg-muted">
													<X className="h-3 w-3" />
													<span className="sr-only">Remove {skill}</span>
												</button>
											</Badge>
										))}
										{skills.length === 0 && <p className="text-sm text-muted-foreground">Add skills that you can mentor others in.</p>}
									</div>
									<div className="flex gap-2">
										{/* <Input
											placeholder="Add a skill..."
											value={newSkill}
											onChange={(e) => setNewSkill(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													e.preventDefault();
													handleAddSkill();
												}
											}}
										/>
										<Button type="button" onClick={handleAddSkill} size="sm">
											<Plus className="h-4 w-4" />
											<span className="sr-only">Add Skill</span>
										</Button> */}
										<MultipleSelector
											value={[{ label: "", value: "" }]}
											onChange={handleAddSkill}
											defaultOptions={SKILL_OPTIONS}
											placeholder="Select or type interests..."
											creatable
											emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching interests found.</p>}
											className="w-full"
										/>
									</div>
									<p className="text-xs text-muted-foreground">Add specific skills like "JavaScript", "React", "Data Analysis", etc.</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="years-experience">Years of Experience</Label>
									<Select>
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
							<div>
								<div className="space-y-4">
									<div className="flex items-center gap-2">
										<BriefcaseBusiness className="h-5 w-5 text-primary" />
										<h3 className="font-medium">Work Experience</h3>
									</div>

									{workExperiences.map((experience, index) => (
										<div key={index} className="rounded-lg border p-4 space-y-4 relative">
											<div className="space-y-2">
												<Label htmlFor={`job-title-${index}`}>Job Title</Label>
												<Input id={`job-title-${index}`} placeholder="e.g. Senior Software Engineer" value={experience.jobTitle} onChange={(e) => handleWorkExperienceChange(index, "jobTitle", e.target.value)} />
											</div>

											<div className="space-y-2">
												<Label htmlFor={`company-${index}`}>Company</Label>
												<Input id={`company-${index}`} placeholder="e.g. Acme Inc." value={experience.company} onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)} />
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`start-date-${index}`}>Start Date</Label>
													<Input id={`start-date-${index}`} type="month" value={experience.startDate} onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)} />
												</div>
												<div className="space-y-2">
													<Label htmlFor={`end-date-${index}`}>End Date</Label>
													<Input id={`end-date-${index}`} type="month" value={experience.endDate} disabled={experience.currentJob} onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)} />
													<div className="flex items-center space-x-2 mt-1">
														<Checkbox id={`current-job-${index}`} checked={experience.currentJob} onCheckedChange={(checked) => handleWorkExperienceChange(index, "currentJob", checked)} />
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
													placeholder="Describe your responsibilities and achievements..."
													value={experience.description}
													onChange={(e) => handleWorkExperienceChange(index, "description", e.target.value)}
												/>
											</div>

											{workExperiences.length > 1 && (
												<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveWorkExperience(index)}>
													<X className="h-4 w-4" />
													<span className="sr-only">Remove Experience</span>
												</Button>
											)}
										</div>
									))}

									<Button variant="outline" className="w-full " onClick={handleAddWorkExperience}>
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

									{educations.map((education, index) => (
										<div key={index} className="rounded-lg border p-4 space-y-4 relative">
											<div className="space-y-2">
												<Label htmlFor={`degree-${index}`}>Degree</Label>
												<Input id={`degree-${index}`} placeholder="e.g. Bachelor of Science in Computer Science" value={education.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} />
											</div>

											<div className="space-y-2">
												<Label htmlFor={`institution-${index}`}>Institution</Label>
												<Input id={`institution-${index}`} placeholder="e.g. Stanford University" value={education.institution} onChange={(e) => handleEducationChange(index, "institution", e.target.value)} />
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`edu-start-date-${index}`}>Start Year</Label>
													<Input id={`edu-start-date-${index}`} type="number" placeholder="e.g. 2015" value={education.startYear} onChange={(e) => handleEducationChange(index, "startYear", e.target.value)} />
												</div>
												<div className="space-y-2">
													<Label htmlFor={`edu-end-date-${index}`}>End Year</Label>
													<Input id={`edu-end-date-${index}`} type="number" placeholder="e.g. 2019" value={education.endYear} onChange={(e) => handleEducationChange(index, "endYear", e.target.value)} />
												</div>
											</div>

											{educations.length > 1 && (
												<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveEducation(index)}>
													<X className="h-4 w-4" />
													<span className="sr-only">Remove Education</span>
												</Button>
											)}
										</div>
									))}

									<Button variant="outline" className="w-full" onClick={handleAddEducation}>
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

									{certifications.map((certification, index) => (
										<div key={index} className="rounded-lg border p-4 space-y-4 relative">
											<div className="space-y-2">
												<Label htmlFor={`certification-${index}`}>Certification Name</Label>
												<Input id={`certification-${index}`} placeholder="e.g. AWS Certified Solutions Architect" value={certification.name} onChange={(e) => handleCertificationChange(index, "name", e.target.value)} />
											</div>

											<div className="space-y-2">
												<Label htmlFor={`issuing-org-${index}`}>Issuing Organization</Label>
												<Input id={`issuing-org-${index}`} placeholder="e.g. Amazon Web Services" value={certification.issuingOrg} onChange={(e) => handleCertificationChange(index, "issuingOrg", e.target.value)} />
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor={`issue-date-${index}`}>Issue Date</Label>
													<Input id={`issue-date-${index}`} type="month" value={certification.issueDate} onChange={(e) => handleCertificationChange(index, "issueDate", e.target.value)} />
												</div>
												<div className="space-y-2">
													<Label htmlFor={`expiry-date-${index}`}>Expiry Date (if applicable)</Label>
													<Input id={`expiry-date-${index}`} type="month" value={certification.expiryDate} onChange={(e) => handleCertificationChange(index, "expiryDate", e.target.value)} />
												</div>
											</div>

											{certifications.length > 1 && (
												<Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => handleRemoveCertification(index)}>
													<X className="h-4 w-4" />
													<span className="sr-only">Remove Certification</span>
												</Button>
											)}
										</div>
									))}

									<Button variant="outline" className="w-full" onClick={handleAddCertification}>
										<Plus className="mr-2 h-4 w-4" />
										Add Another Certification
									</Button>
								</div>
							</div>
						)}

						{/* Step 4: Mentoring Preferences */}
						{step === 4 && (
							<>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label className="font-bold">Session Format</Label>
										<RadioGroup defaultValue="both">
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
												<Checkbox id="video-calls" defaultChecked />
												<Label htmlFor="video-calls" className="font-normal">
													Video Calls
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox id="chat" defaultChecked />
												<Label htmlFor="chat" className="font-normal">
													Text Chat
												</Label>
											</div>
											{/* <div className="flex items-center space-x-2">
												<Checkbox id="in-person" />
												<Label htmlFor="both" className="font-normal">
													Both Video Calls and Text Chat
												</Label>
											</div> */}
										</div>
									</div>

									<Separator />

									<div className="space-y-2">
										<Label className="font-bold">Session Pricing</Label>
										<RadioGroup defaultValue="both-pricing">
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
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="both-pricing" id="both-pricing" />
												<Label htmlFor="both-pricing" className="font-normal">
													Both Free and Paid Sessions
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
											<Input id="hourly-rate" className="pl-9" placeholder="e.g. 150" />
										</div>
										<p className="text-xs text-muted-foreground">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
									</div>

									<Separator />

									<div className="space-y-2">
										<Label className="font-bold">Availability</Label>
										<div className="space-y-2">
											<div className="flex items-center space-x-2">
												<Checkbox id="weekdays" />
												<Label htmlFor="weekdays" className="font-normal">
													Weekdays
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox id="weekends" />
												<Label htmlFor="weekends" className="font-normal">
													Weekends
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox id="evenings" />
												<Label htmlFor="evenings" className="font-normal">
													Evenings
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox id="always" defaultChecked />
												<Label htmlFor="always" className="font-normal">
													Always
												</Label>
											</div>
										</div>
									</div>
								</div>
							</>
						)}

						{/* Step 5: Documents & Verification */}
						{step === 5 && (
							<>
								<div className="space-y-4">
									<div className="rounded-lg border border-dashed p-6 text-center">
										<div className="flex flex-col items-center gap-2">
											<Upload className="h-8 w-8 text-muted-foreground" />
											<h3 className="font-medium">Upload Supporting Documents</h3>
											<p className="text-sm text-muted-foreground">Upload your resume, certifications, or any other documents that verify your expertise</p>
											<Button onClick={handleAddDocument} className="mt-2">
												<Upload className="mr-2 h-4 w-4" />
												Select Files
											</Button>
										</div>
									</div>

									{documents.length > 0 && (
										<div className="space-y-2">
											<Label>Uploaded Documents</Label>
											<div className="space-y-2">
												{documents.map((doc) => (
													<div key={doc.name} className="flex items-center justify-between rounded-lg border p-3">
														<div className="flex items-center gap-2">
															<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
																<BookOpen className="h-5 w-5 text-primary" />
															</div>
															<div>
																<p className="font-medium">{doc.name}</p>
																<p className="text-xs text-muted-foreground">{doc.size}</p>
															</div>
														</div>
														<Button variant="ghost" size="sm" onClick={() => handleRemoveDocument(doc.name)}>
															<X className="h-4 w-4" />
															<span className="sr-only">Remove {doc.name}</span>
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
												<Checkbox id="terms" />
												<Label htmlFor="terms" className="text-sm font-normal">
													I confirm that all information provided is accurate and complete
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox id="guidelines" />
												<Label htmlFor="guidelines" className="text-sm font-normal">
													I have read and agree to the Mentor Guidelines and Code of Conduct
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<Checkbox id="interview" />
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
	);
}
