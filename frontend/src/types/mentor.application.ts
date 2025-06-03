export enum WeekDay {
	Monday = "Monday",
	Tuesday = "Tuesday",
	Wednesday = "Wednesday",
	Thursday = "Thursday",
	Friday = "Friday",
	Saturday = "Saturday",
	Sunday = "Sunday",
}

export interface WorkExperience {
	jobTitle: string;
	company: string;
	startDate: string;
	endDate: string;
	currentJob: boolean;
	description: string;
}

export interface Education {
	degree: string;
	institution: string;
	startYear: string;
	endYear: string;
}

export interface Certification {
	name: string;
	issuingOrg: string;
	issueDate: string;
	expiryDate: string;
}

export interface MentorApplicationFormData {
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
	availability: Partial<Record<WeekDay, string[]>>;
	documents: File[];
	terms: boolean;
	guidelines: boolean;
	interview: boolean;
}
