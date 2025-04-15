// src/utils/validateMentorForm.ts
import { MentorApplication, FormErrors, WorkExperience, Education, Certification } from "@/types/mentor.application";

export const validateFormData = (data: MentorApplication): { isValid: boolean; errors: FormErrors } => {
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
	if (!data.terms) errors.terms = "You must confirm the accuracy of the information";
	if (!data.guidelines) errors.guidelines = "You must agree to the Mentor Guidelines";
	if (!data.interview) errors.interview = "You must acknowledge the interview possibility";

	// Work Experiences
	data.workExperiences.forEach((exp: WorkExperience, index: number) => {
		if (!exp.jobTitle.trim()) errors[`workExperiences[${index}].jobTitle`] = "Job title is required";
		if (!exp.company.trim()) errors[`workExperiences[${index}].company`] = "Company is required";
		if (!exp.startDate) {
			errors[`workExperiences[${index}].startDate`] = "Start date is required";
		} else if (!/^\d{4}-\d{2}$/.test(exp.startDate)) {
			errors[`workExperiences[${index}].startDate`] = "Start date must be in YYYY-MM format";
		}
		if (!exp.currentJob && !exp.endDate) {
			errors[`workExperiences[${index}].endDate`] = "End date is required unless current job";
		} else if (exp.endDate && !/^\d{4}-\d{2}$/.test(exp.endDate)) {
			errors[`workExperiences[${index}].endDate`] = "End date must be in YYYY-MM format";
		}
		if (!exp.description.trim()) errors[`workExperiences[${index}].description`] = "Description is required";

		if (exp.startDate && /^\d{4}-\d{2}$/.test(exp.startDate)) {
			const start = new Date(`${exp.startDate}-01`);
			if (isNaN(start.getTime())) {
				errors[`workExperiences[${index}].startDate`] = "Invalid start date";
			} else if (start > currentDate) {
				errors[`workExperiences[${index}].startDate`] = "Start date cannot be in the future";
			}

			if (!exp.currentJob && exp.endDate && /^\d{4}-\d{2}$/.test(exp.endDate)) {
				const end = new Date(`${exp.endDate}-01`);
				if (isNaN(end.getTime())) {
					errors[`workExperiences[${index}].endDate`] = "Invalid end date";
				} else {
					if (end < start) {
						errors[`workExperiences[${index}].endDate`] = "End date must be after start date";
					}
					if (end > currentDate) {
						errors[`workExperiences[${index}].endDate`] = "End date cannot be in the future";
					}
				}
			}
		}
	});

	// Educations
	data.educations.forEach((edu: Education, index: number) => {
		if (!edu.degree.trim()) errors[`educations[${index}].degree`] = "Degree is required";
		if (!edu.institution.trim()) errors[`educations[${index}].institution`] = "Institution is required";
		if (!edu.startYear) {
			errors[`educations[${index}].startYear`] = "Start year is required";
		} else if (!/^\d{4}$/.test(edu.startYear)) {
			errors[`educations[${index}].startYear`] = "Start year must be a 4-digit number";
		}
		if (!edu.endYear) {
			errors[`educations[${index}].endYear`] = "End year is required";
		} else if (!/^\d{4}$/.test(edu.endYear)) {
			errors[`educations[${index}].endYear`] = "End year must be a 4-digit number";
		}

		if (edu.startYear && /^\d{4}$/.test(edu.startYear)) {
			const startYearNum = Number(edu.startYear);
			if (startYearNum > currentYear) {
				errors[`educations[${index}].startYear`] = "Start year cannot be in the future";
			}
			if (startYearNum < 1900) {
				errors[`educations[${index}].startYear`] = "Start year is too early";
			}
		}

		if (edu.endYear && /^\d{4}$/.test(edu.endYear)) {
			const endYearNum = Number(edu.endYear);
			if (endYearNum > currentYear) {
				errors[`educations[${index}].endYear`] = "End year cannot be in the future";
			}
			if (edu.startYear && /^\d{4}$/.test(edu.startYear) && endYearNum < Number(edu.startYear)) {
				errors[`educations[${index}].endYear`] = "End year must be after start year";
			}
		}
	});

	// Certifications
	data.certifications.forEach((cert: Certification, index: number) => {
		if (!cert.name.trim()) errors[`certifications[${index}].name`] = "Name is required";
		if (!cert.issuingOrg.trim()) errors[`certifications[${index}].issuingOrg`] = "Issuing organization is required";
		if (!cert.issueDate) {
			errors[`certifications[${index}].issueDate`] = "Issue date is required";
		} else if (!/^\d{4}-\d{2}$/.test(cert.issueDate)) {
			errors[`certifications[${index}].issueDate`] = "Issue date must be in YYYY-MM format";
		}

		if (cert.issueDate && /^\d{4}-\d{2}$/.test(cert.issueDate)) {
			const issue = new Date(`${cert.issueDate}-01`);
			if (isNaN(issue.getTime())) {
				errors[`certifications[${index}].issueDate`] = "Invalid issue date";
			} else if (issue > currentDate) {
				errors[`certifications[${index}].issueDate`] = "Issue date cannot be in the future";
			}
		}

		if (cert.expiryDate) {
			if (!/^\d{4}-\d{2}$/.test(cert.expiryDate)) {
				errors[`certifications[${index}].expiryDate`] = "Expiry date must be in YYYY-MM format";
			} else {
				const issue = cert.issueDate && /^\d{4}-\d{2}$/.test(cert.issueDate) ? new Date(`${cert.issueDate}-01`) : null;
				const expiry = new Date(`${cert.expiryDate}-01`);
				if (isNaN(expiry.getTime())) {
					errors[`certifications[${index}].expiryDate`] = "Invalid expiry date";
				} else if (issue && !isNaN(issue.getTime()) && expiry < issue) {
					errors[`certifications[${index}].expiryDate`] = "Expiry date must be after issue date";
				}
			}
		}
	});

	// Documents
	data.documents.forEach((file: File, index: number) => {
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
