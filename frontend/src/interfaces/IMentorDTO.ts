export enum WeekDay {
	Monday = "Monday",
	Tuesday = "Tuesday",
	Wednesday = "Wednesday",
	Thursday = "Thursday",
	Friday = "Friday",
	Saturday = "Saturday",
	Sunday = "Sunday",
}

export type Availability = {
	[key in WeekDay]: string[];
};

export interface IMentorDTO {
	id: string;
	email: string;
	firstName: string;
	role: "user" | "mentor";
	lastName: string;
	avatar: string | null;
	bio: string | null;
	interests: string[] | null;
	updatedAt: Date | null;
	skills: string[] | null;
	status: "blocked" | "unblocked";
	mentorRequestStatus: "pending" | "approved" | "rejected" | "not-requested";
	createdAt: Date;
	averageRating: number | null;
	totalReviews: number | null;
	sessionCompleted: number | null;
	badges: string[] | null;
	userId: string;
	professionalTitle: string;
	languages: string[];
	primaryExpertise: string;
	yearsExperience: string;
	workExperiences: {
		jobTitle: string;
		company: string;
		startDate: string;
		endDate: string | null;
		currentJob: boolean;
		description: string;
	}[];
	educations: {
		degree: string;
		institution: string;
		startYear: string;
		endYear: string;
	}[];
	certifications: {
		name: string;
		issuingOrg: string;
		issueDate: string;
		expiryDate: string | null;
	}[];
	sessionFormat: "one-on-one" | "group" | "both";
	pricing: "free" | "paid" | "both-pricing";
	hourlyRate: number | null;
	availability: Availability;
	documents: string[];
}
