export interface IMentorDTO {
	email: string;
	password: string;
	firstName: string;
	role: "user" | "mentor";
	lastName: string;
	avatar: string | null;
	bio: string | null;
	interests: object[] | null;
	updatedAt: Date;
	skills: string[] | null;
	status: "blocked" | "unblocked";
	mentorRequestStatus: "pending" | "approved" | "rejected" | "not-requested";
	createdAt: Date;
	lastActive: Date | null;
	isVerified: boolean | null;
	rating: number | null;
	sessionCompleted: number | null;
	featuredMentor: boolean | null;
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
	sessionTypes: string[];
	pricing: "free" | "paid" | "both-pricing";
	hourlyRate: string | null;
	availability: string[];
	documents: string[];
	reviews: {
		name: string;
		avatar: string;
		rating: number;
		date: string;
		comment: string;
	}[];
}
