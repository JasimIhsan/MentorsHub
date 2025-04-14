export interface WorkExperience {
	jobTitle: string;
	company: string;
	startDate: string;
	endDate: string | null;
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
	expiryDate: string | null;
}

export type SessionFormat = "one-on-one" | "group" | "both";
export type PricingType = "free" | "paid" | "both-pricing";

export interface IMentorInterface {
	id?: string; // MongoDB _id
	userId: string; // reference to user
	professionalTitle: string;
	languages: string[];
	primaryExpertise: string;
	yearsExperience: string;
	workExperiences: WorkExperience[];
	educations: Education[];
	certifications: Certification[];
	sessionFormat: SessionFormat;
	sessionTypes: string[];
	pricing: PricingType;
	hourlyRate: string | null;
	availability: string[];
	documents: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export class MentorProfileEntity {
	private id?: string;
	private userId: string;
	private professionalTitle: string;
	private languages: string[];
	private primaryExpertise: string;
	private yearsExperience: string;
	private workExperiences: WorkExperience[];
	private educations: Education[];
	private certifications: Certification[];
	private sessionFormat: SessionFormat;
	private sessionTypes: string[];
	private pricing: PricingType;
	private hourlyRate: string | null;
	private availability: string[];
	private documents: string[];
	private createdAt: Date;
	private updatedAt?: Date;

	constructor(mentor: IMentorInterface) {
		this.id = mentor.id;
		this.userId = mentor.userId;
		this.professionalTitle = mentor.professionalTitle;
		this.languages = mentor.languages;
		this.primaryExpertise = mentor.primaryExpertise;
		this.yearsExperience = mentor.yearsExperience;
		this.workExperiences = mentor.workExperiences;
		this.educations = mentor.educations;
		this.certifications = mentor.certifications;
		this.sessionFormat = mentor.sessionFormat;
		this.sessionTypes = mentor.sessionTypes;
		this.pricing = mentor.pricing;
		this.hourlyRate = mentor.hourlyRate;
		this.availability = mentor.availability;
		this.documents = mentor.documents;
		this.createdAt = mentor.createdAt ?? new Date();
		this.updatedAt = mentor.updatedAt ?? new Date();
	}

	static fromDBDocument(doc: any): MentorProfileEntity {
		return new MentorProfileEntity({
			id: doc._id?.toString(),
			userId: doc.userId,
			professionalTitle: doc.professionalTitle,
			languages: doc.languages ?? [],
			primaryExpertise: doc.primaryExpertise,
			yearsExperience: doc.yearsExperience,
			workExperiences: doc.workExperiences ?? [],
			educations: doc.educations ?? [],
			certifications: doc.certifications ?? [],
			sessionFormat: doc.sessionFormat,
			sessionTypes: doc.sessionTypes ?? [],
			pricing: doc.pricing,
			hourlyRate: doc.hourlyRate ?? null,
			availability: doc.availability ?? [],
			documents: doc.documents ?? [],
			createdAt: doc.createdAt ?? new Date(),
			updatedAt: doc.updatedAt ?? new Date(),
		});
	}

	updateMentorDetails(updatedData: Partial<IMentorInterface>) {
		if (updatedData.professionalTitle !== undefined) this.professionalTitle = updatedData.professionalTitle;
		if (updatedData.languages !== undefined) this.languages = updatedData.languages;
		if (updatedData.primaryExpertise !== undefined) this.primaryExpertise = updatedData.primaryExpertise;
		if (updatedData.yearsExperience !== undefined) this.yearsExperience = updatedData.yearsExperience;
		if (updatedData.workExperiences !== undefined) this.workExperiences = updatedData.workExperiences;
		if (updatedData.educations !== undefined) this.educations = updatedData.educations;
		if (updatedData.certifications !== undefined) this.certifications = updatedData.certifications;
		if (updatedData.sessionFormat !== undefined) this.sessionFormat = updatedData.sessionFormat;
		if (updatedData.sessionTypes !== undefined) this.sessionTypes = updatedData.sessionTypes;
		if (updatedData.pricing !== undefined) this.pricing = updatedData.pricing;
		if (updatedData.hourlyRate !== undefined) this.hourlyRate = updatedData.hourlyRate;
		if (updatedData.availability !== undefined) this.availability = updatedData.availability;
		if (updatedData.documents !== undefined) this.documents = updatedData.documents;
		this.updatedAt = new Date();
	}

	// ✅ Getters
	getId(): string | undefined {
		return this.id;
	}

	getUserId(): string {
		return this.userId;
	}

	getTitle(): string {
		return this.professionalTitle;
	}

	getLanguages(): string[] {
		return this.languages;
	}
	
	getPricing(): PricingType {
		return this.pricing;
	}

	getHourlyRate(): string | null {
		return this.hourlyRate;
	}

	getFullProfile(): Partial<IMentorInterface> {
		return {
			id: this.id,
			userId: this.userId,
			professionalTitle: this.professionalTitle,
			languages: this.languages,
			primaryExpertise: this.primaryExpertise,
			yearsExperience: this.yearsExperience,
			workExperiences: this.workExperiences,
			educations: this.educations,
			certifications: this.certifications,
			sessionFormat: this.sessionFormat,
			sessionTypes: this.sessionTypes,
			pricing: this.pricing,
			hourlyRate: this.hourlyRate,
			availability: this.availability,
			documents: this.documents,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}
}
