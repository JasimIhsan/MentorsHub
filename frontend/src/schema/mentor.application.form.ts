import { z } from "zod";

export const formSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	professionalTitle: z.string().min(1, "Professional title is required"),
	bio: z.string().min(10, "Bio must be at least 10 characters"),
	languages: z.array(z.string()).min(1, "Select at least one language"),
	primaryExpertise: z.string().min(1, "Primary expertise is required"),
	skills: z.array(z.string()).min(1, "Add at least one skill"),
	yearsExperience: z.string().min(1, "Years of experience is required"),
	workExperiences: z
		.array(
			z.object({
				jobTitle: z.string().min(1, "Job title is required"),
				company: z.string().min(1, "Company is required"),
				startDate: z.string().min(1, "Start date is required"),
				endDate: z.string().optional(),
				currentJob: z.boolean(),
				description: z.string().min(10, "Description must be at least 10 characters"),
			})
		)
		.min(1, "Add at least one work experience"),
	educations: z
		.array(
			z.object({
				degree: z.string().min(1, "Degree is required"),
				institution: z.string().min(1, "Institution is required"),
				startYear: z.string().min(1, "Start year is required"),
				endYear: z.string().min(1, "End year is required"),
			})
		)
		.optional(),
	certifications: z
		.array(
			z.object({
				name: z.string().min(1, "Certification name is required"),
				issuingOrg: z.string().min(1, "Issuing organization is required"),
				issueDate: z.string().min(1, "Issue date is required"),
				expiryDate: z.string().optional(),
			})
		)
		.optional(),
	sessionFormat: z.enum(["one-on-one", "group", "both"], { required_error: "Session format is required" }),
	sessionTypes: z.array(z.enum(["video-calls", "chat", "in-person"])).min(1, "Select at least one session type"),
	pricing: z.enum(["free", "paid", "both-pricing"], { required_error: "Pricing is required" }),
	hourlyRate: z.string().optional(),
	availability: z.array(z.enum(["weekdays", "weekends", "evenings"])).min(1, "Select at least one availability option"),
	hoursPerWeek: z.string().min(1, "Hours per week is required"),
	sessionLength: z.string().min(1, "Session length is required"),
	documents: z.any().optional(), // Files handled separately
	terms: z.boolean().refine((val) => val === true, "You must agree to the terms"),
	guidelines: z.boolean().refine((val) => val === true, "You must agree to the guidelines"),
	interview: z.boolean().refine((val) => val === true, "You must agree to the interview process"),
});

export type MentorApplicationFormData = z.infer<typeof formSchema>;
