import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IReviewDocument extends Document {
	reviewer: ObjectId; // User (mentee)
	mentor: ObjectId; // Mentor being reviewed
	session: ObjectId | null; // Optional: link to session
	rating: number; // 1 to 5
	comment: string;
	createdAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
	{
		reviewer: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		mentor: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		session: { type: Schema.Types.ObjectId, ref: "Sessions", default: null },
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: { type: String, required: true },
	},
	{ timestamps: true }
);

export const ReviewModel = mongoose.model<IReviewDocument>("Review", ReviewSchema);
