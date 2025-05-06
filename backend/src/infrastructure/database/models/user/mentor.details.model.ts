import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMentorProfileModel extends Document {
	userId: ObjectId;
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
	availability: string[];
	hoursPerWeek: string;
	documents: string[]; // Array of S3 URLs
	createdAt: Date;
	updatedAt: Date;
}

const MentorProfileSchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "Users", required: true, unique: true },
		professionalTitle: { type: String, required: true },
		languages: [{ type: String, required: true }],
		primaryExpertise: { type: String, required: true },
		yearsExperience: { type: String, required: true },
		workExperiences: [
			{
				jobTitle: { type: String, required: true },
				company: { type: String, required: true },
				startDate: { type: String, required: true },
				endDate: { type: String },
				currentJob: { type: Boolean, default: false },
				description: { type: String, required: true },
			},
		],
		educations: [
			{
				degree: { type: String, required: true },
				institution: { type: String, required: true },
				startYear: { type: String, required: true },
				endYear: { type: String, required: true },
			},
		],
		certifications: [
			{
				name: { type: String, required: true },
				issuingOrg: { type: String, required: true },
				issueDate: { type: String, required: true },
				expiryDate: { type: String },
			},
		],
		sessionFormat: { type: String, enum: ["one-on-one", "group", "both"], required: true },
		sessionTypes: [{ type: String, required: true }],
		pricing: { type: String, enum: ["free", "paid", "both-pricing"], required: true },
		hourlyRate: { type: Number },
		availability: [{ type: String, required: true }],
		documents: [{ type: String }],
	},
	{ timestamps: true }
);

export const MentorProfileModel = mongoose.model<IMentorProfileModel>("MentorProfile", MentorProfileSchema);
