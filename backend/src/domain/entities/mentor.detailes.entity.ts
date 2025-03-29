import { ObjectId } from "mongoose";

export interface IMentorDetails {
	id?: string;
	userId: ObjectId;
	certifications: {
		issuer: string;
		name: string;
		url: string;
		year: string;
	}[];
	education: {
		degree: string;
		institution: string;
		year: string;
	}[];
	expertiseIn?: ObjectId[] | null;
	title?: string | null;
	yearOfExperience?: number | null;
	createdAt: Date;
	updatedAt?: Date | null;
	featuredMentor?: boolean | null;
	isVerified?: boolean;
	mentorRequestStatus?: "approved" | "rejected" | "pending" | 'not applied';
	rating?: number | null;
}

export class MentorProfileEntity {
	constructor(public mentorProfile: IMentorDetails) {}

	static create(userId: ObjectId, data: Partial<IMentorDetails>): MentorProfileEntity {
		return new MentorProfileEntity({
			userId,
			certifications: data.certifications || [],
			education: data.education || [],
			expertiseIn: data.expertiseIn || null,
			title: data.title || null,

			yearOfExperience: data.yearOfExperience || null,
			createdAt: new Date(),
			updatedAt: data.updatedAt || null,
		});
	}
}
