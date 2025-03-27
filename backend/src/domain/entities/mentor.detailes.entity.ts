import { ObjectId } from "mongoose";

export interface MentorDetails {
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
}

export class MentorProfileEntity {
	constructor(public mentorProfile: MentorDetails) {}

	static create(userId: ObjectId, data: Partial<MentorDetails>): MentorProfileEntity {
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
