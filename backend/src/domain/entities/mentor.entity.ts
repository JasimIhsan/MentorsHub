import { MentorRequestStatusEnum } from "../../application/interfaces/enums/mentor.request.status.enum";
import { RoleEnum } from "../../application/interfaces/enums/role.enum";
import { UserStatusEnums } from "../../application/interfaces/enums/user.status.enums";
import { Availability } from "./mentor.detailes.entity";

export interface MentorEntityProps {
	id: string;
	email: string;
	firstName: string;
	role: RoleEnum.USER | RoleEnum.MENTOR;
	lastName: string;
	avatar: string | null;
	bio: string | null;
	interests: string[] | null;
	updatedAt: Date | null;
	skills: string[] | null;
	status: UserStatusEnums;
	mentorRequestStatus: MentorRequestStatusEnum;
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
	sessionTypes: string[];
	pricing: "free" | "paid" | "both-pricing";
	hourlyRate: number | null;
	availability: Availability;
	documents: string[];
}

export class MentorEntity {
	constructor(private props: MentorEntityProps) {}

	get id() {
		return this.props.id;
	}

	get email() {
		return this.props.email;
	}

	get firstName() {
		return this.props.firstName;
	}

	get role() {
		return this.props.role;
	}

	get lastName() {
		return this.props.lastName;
	}

	get avatar() {
		return this.props.avatar;
	}

	get bio() {
		return this.props.bio;
	}

	get interests() {
		return this.props.interests;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get skills() {
		return this.props.skills;
	}

	get status() {
		return this.props.status;
	}

	get mentorRequestStatus() {
		return this.props.mentorRequestStatus;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get averageRating() {
		return this.props.averageRating;
	}

	get totalReviews() {
		return this.props.totalReviews;
	}

	get sessionCompleted() {
		return this.props.sessionCompleted;
	}

	get badges() {
		return this.props.badges;
	}

	get userId() {
		return this.props.userId;
	}

	get professionalTitle() {
		return this.props.professionalTitle;
	}

	get languages() {
		return this.props.languages;
	}

	get primaryExpertise() {
		return this.props.primaryExpertise;
	}

	get yearsExperience() {
		return this.props.yearsExperience;
	}

	get workExperiences() {
		return this.props.workExperiences;
	}

	get educations() {
		return this.props.educations;
	}

	get certifications() {
		return this.props.certifications;
	}

	get sessionFormat() {
		return this.props.sessionFormat;
	}

	get sessionTypes() {
		return this.props.sessionTypes;
	}

	get pricing() {
		return this.props.pricing;
	}

	get hourlyRate() {
		return this.props.hourlyRate;
	}

	get availability() {
		return this.props.availability;
	}

	get documents() {
		return this.props.documents;
	}

	static fromMongo(doc: any): MentorEntity {
		const user = doc.userId || {};
		return new MentorEntity({
			id: doc._id.toString(),
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			avatar: user.avatar,
			bio: user.bio,
			interests: user.interests,
			updatedAt: user.updatedAt,
			skills: user.skills,
			status: user.status,
			mentorRequestStatus: user.mentorRequestStatus,
			createdAt: doc.createdAt,
			averageRating: user.averageRating,
			totalReviews: user.totalReviews,
			sessionCompleted: user.sessionCompleted,
			badges: user.badges,
			userId: user._id.toString(),
			professionalTitle: doc.professionalTitle,
			languages: doc.languages,
			primaryExpertise: doc.primaryExpertise,
			yearsExperience: doc.yearsExperience,
			workExperiences: doc.workExperiences,
			educations: doc.educations,
			certifications: doc.certifications,
			sessionFormat: doc.sessionFormat,
			sessionTypes: doc.sessionTypes,
			pricing: doc.pricing,
			hourlyRate: doc.hourlyRate,
			availability: doc.availability,
			documents: doc.documents,
		});
	}
}
