import { MentorApplicationFormData } from "@/interfaces/mentor.application";

// Validation function
export const validateFormData = (data: MentorApplicationFormData): { isValid: boolean; errors: string[] } => {
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
	if (!data.pricing) errors.push("Pricing preference is required");
	if (data.pricing !== "free" && !data.hourlyRate) errors.push("Hourly rate is required for paid sessions");
	if (!data.terms) errors.push("You must confirm the accuracy of the information");
	if (!data.guidelines) errors.push("You must agree to the Mentor Guidelines");
	if (!data.interview) errors.push("You must acknowledge the interview possibility");
	if (!data.documents || data.documents.length === 0) errors.push("At least one document is required");
	if (!Object.values(data.availability).some((times) => times && times.length > 0)) {
		errors.push("At least one availability time slot is required");
	}

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
