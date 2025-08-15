import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IReviewDocument extends Document {
	_id: ObjectId;
	reviewerId: ObjectId; // User (mentee)
	mentorId: ObjectId; // Mentor being reviewed
	sessionId: ObjectId | null; // Optional: link to session
	rating: number; // 1 to 5
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
	{
		reviewerId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		mentorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		sessionId: { type: Schema.Types.ObjectId, ref: "Sessions", default: null },
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
		comment: { type: String, required: true },
	},
	{ timestamps: true },
);

export const ReviewModel = mongoose.model<IReviewDocument>("Review", ReviewSchema);
