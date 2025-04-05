import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IMentorDetails extends Document {
	_id: ObjectId;
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
	expertiseIn: ObjectId[] | null;
	title: string | null;
	yearOfExperience: number | null;
	createdAt: Date;
	updatedAt: Date | null;
}

const MentorDetailsSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "Users",
		required: true,
		unique: true,
	},
	certifications: [
		{
			issuer: { type: String, required: true },
			name: { type: String, required: true },
			url: { type: String, required: true },
			year: { type: String, required: true },
		},
	],
	education: [
		{
			degree: { type: String, required: true },
			institution: { type: String, required: true },
			year: { type: String, required: true },
		},
	],
	expertiseIn: [{ type: Schema.Types.ObjectId }],
	title: { type: String },
	yearOfExperience: { type: Number },
	createdAt: { type: Date, default: Date.now, required: true },
	updatedAt: { type: Date },
});

export const MentorDetailsModel = mongoose.model<IMentorDetails>("MentorDetails", MentorDetailsSchema);
