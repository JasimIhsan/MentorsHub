import { Availability, MentorProfileEntity } from "../../domain/entities/mentor.detailes.entity";
import { MentorEntity } from "../../domain/entities/mentor.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { MentorRequestStatusEnum } from "../interfaces/enums/mentor.request.status.enum";
import { RoleEnum } from "../interfaces/enums/role.enum";
import { UserStatusEnums } from "../interfaces/enums/user.status.enums";

export interface IMentorDTO {
	id: string;
	email: string;
	firstName: string;
	role: RoleEnum;
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
	pricing: "free" | "paid" | "both-pricing";
	hourlyRate: number;
	availability: Availability;
	documents: string[];
}

export function mapToMentorDTO(userEntity: UserEntity, mentorEntity: MentorProfileEntity): IMentorDTO {
	return {
		id: mentorEntity.id!,
		email: userEntity.email,
		firstName: userEntity.firstName,
		role: userEntity.role,
		lastName: userEntity.lastName,
		avatar: userEntity.avatar,
		bio: userEntity.bio,
		interests: userEntity.interests,
		updatedAt: userEntity.updatedAt,
		skills: userEntity.skills,
		status: userEntity.status,
		mentorRequestStatus: userEntity.mentorRequestStatus,
		createdAt: userEntity.createdAt,
		averageRating: userEntity.averageRating,
		totalReviews: userEntity.totalReviews,
		sessionCompleted: userEntity.sessionCompleted,
		badges: userEntity.badges,
		userId: userEntity.id!,
		professionalTitle: mentorEntity.professionalTitle,
		languages: mentorEntity.languages,
		primaryExpertise: mentorEntity.primaryExpertise,
		yearsExperience: mentorEntity.yearsExperience,
		workExperiences: mentorEntity.workExperiences,
		educations: mentorEntity.educations,
		availability: mentorEntity.availability,
		certifications: mentorEntity.certifications,
		documents: mentorEntity.documents,
		sessionFormat: mentorEntity.sessionFormat,
		pricing: mentorEntity.pricing,
		hourlyRate: mentorEntity.hourlyRate,
	};
}


export function mapToMentorDTOWithoutUser(mentorEntity: MentorEntity): IMentorDTO {
	return {
		id: mentorEntity.id!,
		userId: mentorEntity.userId!,
		email: mentorEntity.email,
		firstName: mentorEntity.firstName,
		role: mentorEntity.role,
		lastName: mentorEntity.lastName,
		avatar: mentorEntity.avatar,
		bio: mentorEntity.bio,
		interests: mentorEntity.interests,
		updatedAt: mentorEntity.updatedAt,
		skills: mentorEntity.skills,
		status: mentorEntity.status,
		mentorRequestStatus: mentorEntity.mentorRequestStatus,
		createdAt: mentorEntity.createdAt,
		averageRating: mentorEntity.averageRating,
		totalReviews: mentorEntity.totalReviews,
		sessionCompleted: mentorEntity.sessionCompleted,
		badges: mentorEntity.badges,
		professionalTitle: mentorEntity.professionalTitle,
		languages: mentorEntity.languages,
		primaryExpertise: mentorEntity.primaryExpertise,
		yearsExperience: mentorEntity.yearsExperience,
		workExperiences: mentorEntity.workExperiences,
		educations: mentorEntity.educations,
		availability: mentorEntity.availability,
		certifications: mentorEntity.certifications,
		documents: mentorEntity.documents,
		sessionFormat: mentorEntity.sessionFormat,
		pricing: mentorEntity.pricing,
		hourlyRate: mentorEntity.hourlyRate,
	};
}