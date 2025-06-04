import { IReviewDocument } from "../../infrastructure/database/models/review-rating/review.model";

export interface IReviewEntity {
	id?: string;
	reviewerId: string;
	mentorId: string;
	sessionId?: string;
	rating: number;
	comment: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export class ReviewEntity {
	private _id?: string;
	private reviewerId: string;
	private mentorId: string;
	private sessionId?: string;
	private rating: number;
	private comment: string;
	private createdAt: Date;
	private updatedAt: Date;

	constructor(data: IReviewEntity) {
		this._id = data.id;
		this.reviewerId = data.reviewerId;
		this.mentorId = data.mentorId;
		this.sessionId = data.sessionId;
		this.rating = data.rating;
		this.comment = data.comment;
		this.createdAt = data.createdAt ?? new Date();
		this.updatedAt = data.updatedAt ?? new Date();
	}

	// --- GETTERS ---

	get id(): string | undefined {
		return this._id;
	}

	getReviewerId(): string {
		return this.reviewerId;
	}

	getMentorId(): string {
		return this.mentorId;
	}

	getSessionId(): string | undefined {
		return this.sessionId;
	}

	getRating(): number {
		return this.rating;
	}

	getComment(): string {
		return this.comment;
	}

	getCreatedAt(): Date {
		return this.createdAt;
	}

	getUpdatedAt(): Date {
		return this.updatedAt;
	}

	// --- METHODS ---

	updateComment(comment: string): void {
		this.comment = comment;
		this.updatedAt = new Date();
	}

	updateRating(rating: number): void {
		if (rating < 1 || rating > 5) {
			throw new Error("Rating must be between 1 and 5");
		}
		this.rating = rating;
		this.updatedAt = new Date();
	}

	toObject(): IReviewEntity {
		return {
			id: this._id,
			reviewerId: this.reviewerId,
			mentorId: this.mentorId,
			sessionId: this.sessionId,
			rating: this.rating,
			comment: this.comment,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	static fromDBDocument(doc: IReviewDocument): ReviewEntity {
		return new ReviewEntity({
			id: doc._id?.toString(),
			reviewerId: doc.reviewerId?.toString(),
			mentorId: doc.mentorId?.toString(),
			sessionId: doc.sessionId?.toString() ?? "",
			rating: doc.rating,
			comment: doc.comment,
			createdAt: doc.createdAt ?? new Date(),
		});
	}
}
