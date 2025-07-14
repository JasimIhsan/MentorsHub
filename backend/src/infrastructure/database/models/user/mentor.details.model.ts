import mongoose, { Schema, Document, ObjectId } from "mongoose";

enum WeekDay {
	Monday = "Monday",
	Tuesday = "Tuesday",
	Wednesday = "Wednesday",
	Thursday = "Thursday",
	Friday = "Friday",
	Saturday = "Saturday",
	Sunday = "Sunday",
}

type Availability = {
	[key in WeekDay]: string[];
};

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
	pricing: "free" | "paid";
	hourlyRate: number;
	availability: Availability;
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
		pricing: { type: String, enum: ["free", "paid"], required: true },
		hourlyRate: { type: Number, default: 0 },
		availability: {
			type: Map,
			of: [String],
			default: {},
		},
		documents: [{ type: String }],
	},
	{ timestamps: true },
);

export const MentorProfileModel = mongoose.model<IMentorProfileModel>("MentorProfile", MentorProfileSchema);
