/* ---------- Shared value objects & aliases ---------- */
export interface WorkExperience {
	jobTitle: string;
	company: string;
	startDate: string; // yyyy‑mm‑dd ISO string
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

export type SessionFormat = "one-on-one" | "group" | "both";
export type PricingType = "free" | "paid" | "both-pricing";

/* ---------- Aggregate root props ---------- */
export interface MentorProfileProps {
	id?: string; // Mongo _id
	userId: string; // FK to User
	professionalTitle: string;
	languages: string[];
	primaryExpertise: string;
	yearsExperience: string;
	workExperiences: WorkExperience[];
	educations: Education[];
	certifications: Certification[];
	sessionFormat: SessionFormat;
	pricing: PricingType;
	hourlyRate: number;
	availability: Availability;
	documents: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

/* ---------- Domain Entity ---------- */
export class MentorProfileEntity {
	/* All state is private so it can be validated */
	private readonly _id?: string;
	private _userId: string;
	private _professionalTitle: string;
	private _languages: string[];
	private _primaryExpertise: string;
	private _yearsExperience: string;
	private _workExperiences: WorkExperience[];
	private _educations: Education[];
	private _certifications: Certification[];
	private _sessionFormat: SessionFormat;
	private _pricing: PricingType;
	private _hourlyRate: number;
	private _availability: Availability;
	private _documents: string[];
	private readonly _createdAt: Date;
	private _updatedAt: Date;

	/* ===== Factory methods ===== */

	/** Use when *creating a brand‑new* mentor profile */
	public static create(props: MentorProfileProps): MentorProfileEntity {
		//  Basic domain‑level validation
		if (props.pricing === "free" && props.hourlyRate !== 0) {
			throw new Error("hourlyRate must be 0 when pricing is 'free'");
		}
		if (props.pricing === "paid" && (props.hourlyRate === null || props.hourlyRate < 0)) {
			throw new Error("hourlyRate must be a positive number when pricing is 'paid'");
		}
		return new MentorProfileEntity(props);
	}

	/** Use when *re‑hydrating* from persistence (e.g. MongoDB) */
	public static fromDBDocument(doc: any): MentorProfileEntity {
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
			pricing: doc.pricing,
			hourlyRate: doc.hourlyRate ?? null,
			availability: doc.availability ?? {},
			documents: doc.documents ?? [],
			createdAt: doc.createdAt ?? new Date(),
			updatedAt: doc.updatedAt ?? new Date(),
		});
	}

	/* ===== Private ctor – never call directly ===== */
	private constructor(props: MentorProfileProps) {
		this._id = props.id;
		this._userId = props.userId;
		this._professionalTitle = props.professionalTitle;
		this._languages = [...props.languages];
		this._primaryExpertise = props.primaryExpertise;
		this._yearsExperience = props.yearsExperience;
		this._workExperiences = [...props.workExperiences];
		this._educations = [...props.educations];
		this._certifications = [...props.certifications];
		this._sessionFormat = props.sessionFormat;
		this._pricing = props.pricing;
		this._hourlyRate = props.hourlyRate;
		this._availability = { ...props.availability };
		this._documents = [...props.documents];
		this._createdAt = props.createdAt ?? new Date();
		this._updatedAt = props.updatedAt ?? new Date();
	}

	/* ===== Getters ===== */

	get id(): string | undefined {
		return this._id;
	}
	get userId(): string {
		return this._userId;
	}
	get professionalTitle(): string {
		return this._professionalTitle;
	}
	get languages(): string[] {
		return [...this._languages];
	}
	get primaryExpertise(): string {
		return this._primaryExpertise;
	}
	get yearsExperience(): string {
		return this._yearsExperience;
	}
	get workExperiences(): WorkExperience[] {
		return [...this._workExperiences];
	}
	get educations(): Education[] {
		return [...this._educations];
	}
	get certifications(): Certification[] {
		return [...this._certifications];
	}
	get sessionFormat(): SessionFormat {
		return this._sessionFormat;
	}
	get pricing(): PricingType {
		return this._pricing;
	}
	get hourlyRate(): number {
		return this._hourlyRate;
	}
	get availability(): Availability {
		return { ...this._availability };
	}
	get documents(): string[] {
		return [...this._documents];
	}
	get createdAt(): Date {
		return this._createdAt;
	}
	get updatedAt(): Date {
		return this._updatedAt;
	}

	/* ===== Domain‑specific mutators ===== */

	/** Update “profile basics” in one shot (commonly used in a settings screen) */
	public updateMentorProfile(updatedData: Partial<MentorProfileProps>): void {
		// Basic fields
		if (updatedData.professionalTitle !== undefined) this._professionalTitle = updatedData.professionalTitle;
		if (updatedData.primaryExpertise !== undefined) this._primaryExpertise = updatedData.primaryExpertise;
		if (updatedData.yearsExperience !== undefined) this._yearsExperience = updatedData.yearsExperience;
		if (updatedData.languages !== undefined) this._languages = [...updatedData.languages];
		// Array value objects
		if (updatedData.workExperiences !== undefined) this._workExperiences = [...updatedData.workExperiences];
		if (updatedData.educations !== undefined) this._educations = [...updatedData.educations];
		if (updatedData.certifications !== undefined) this._certifications = [...updatedData.certifications];
		if (updatedData.documents !== undefined) this._documents = [...updatedData.documents];
		// Enums & logic-handled
		if (updatedData.pricing !== undefined || updatedData.hourlyRate !== undefined) this.setPricing(updatedData.pricing ?? this._pricing, updatedData.hourlyRate !== undefined ? updatedData.hourlyRate : this._hourlyRate);
		if (updatedData.sessionFormat !== undefined) this._sessionFormat = updatedData.sessionFormat;
		if (updatedData.availability !== undefined) this.setAvailability(updatedData.availability);
		this.touch();
	}

	public setPricing(pricing: PricingType, hourlyRate: number): void {
		if (pricing === "free" && hourlyRate !== 0) {
			throw new Error("hourlyRate must be 0 when pricing is 'free'");
		}
		if (pricing === "paid" && hourlyRate < 0) {
			throw new Error("hourlyRate must be a positive number when pricing is 'paid'");
		}
		this._pricing = pricing;
		this._hourlyRate = hourlyRate;
		this.touch();
	}

	public setAvailability(avail: Availability): void {
		this._availability = { ...avail };
		this.touch();
	}

	public addWorkExperience(exp: WorkExperience): void {
		this._workExperiences.push(exp);
		this.touch();
	}

	public removeWorkExperience(index: number): void {
		this._workExperiences.splice(index, 1);
		this.touch();
	}

	/* ===== Helper ===== */
	private touch(): void {
		this._updatedAt = new Date();
	}

	static toObject(mentor: MentorProfileEntity) {
		return {
			id: mentor.id,
			userId: mentor.userId,
			professionalTitle: mentor.professionalTitle,
			languages: mentor.languages,
			primaryExpertise: mentor.primaryExpertise,
			yearsExperience: mentor.yearsExperience,
			workExperiences: mentor.workExperiences,
			educations: mentor.educations,
			certifications: mentor.certifications,
			sessionFormat: mentor.sessionFormat,
			pricing: mentor.pricing,
			hourlyRate: mentor.hourlyRate,
			availability: mentor.availability,
			documents: mentor.documents,
			createdAt: mentor.createdAt,
			updatedAt: mentor.updatedAt,
		};
	}
}
