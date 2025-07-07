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
	private _reviewerId: string;
	private _mentorId: string;
	private _sessionId?: string;
	private _rating: number;
	private _comment: string;
	private _createdAt: Date;
	private _updatedAt: Date;

	constructor(data: IReviewEntity) {
		this._id = data.id;
		this._reviewerId = data.reviewerId;
		this._mentorId = data.mentorId;
		this._sessionId = data.sessionId;
		this._rating = data.rating;
		this._comment = data.comment;
		this._createdAt = data.createdAt ?? new Date();
		this._updatedAt = data.updatedAt ?? new Date();
	}

	// ----- GETTERS -----
	get id(): string | undefined {
		return this._id;
	}

	get reviewerId(): string {
		return this._reviewerId;
	}

	get mentorId(): string {
		return this._mentorId;
	}

	get sessionId(): string | undefined {
		return this._sessionId;
	}

	get rating(): number {
		return this._rating;
	}

	get comment(): string {
		return this._comment;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	// ----- SETTERS -----
	set rating(value: number) {
		if (value < 1 || value > 5) {
			throw new Error("Rating must be between 1 and 5");
		}
		this._rating = value;
		this._touch();
	}

	set comment(value: string) {
		this._comment = value;
		this._touch();
	}

	set mentorId(value: string) {
		this._mentorId = value;
		this._touch();
	}

	set sessionId(value: string | undefined) {
		this._sessionId = value;
		this._touch();
	}

	set reviewerId(value: string) {
		this._reviewerId = value;
		this._touch();
	}

	private _touch() {
		this._updatedAt = new Date();
	}

	toObject(): IReviewEntity {
		return {
			id: this._id,
			reviewerId: this._reviewerId,
			mentorId: this._mentorId,
			sessionId: this._sessionId,
			rating: this._rating,
			comment: this._comment,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}

	updateFromPartial(data: Partial<IReviewEntity>) {
		if (data.rating !== undefined) this.rating = data.rating;
		if (data.comment !== undefined) this.comment = data.comment;
		if (data.mentorId !== undefined) this.mentorId = data.mentorId;
		if (data.sessionId !== undefined) this.sessionId = data.sessionId;
		if (data.reviewerId !== undefined) this.reviewerId = data.reviewerId;
		if (data.id !== undefined) this._id = data.id;
	}

	static fromDBDocument(doc: IReviewDocument): ReviewEntity {
		return new ReviewEntity({
			id: doc._id?.toString(),
			reviewerId: doc.reviewerId.toString(), // ✅ it's just a string
			mentorId: doc.mentorId?.toString(),
			sessionId: doc.sessionId?.toString() ?? "",
			rating: doc.rating,
			comment: doc.comment,
			createdAt: doc.createdAt ?? new Date(),
			updatedAt: doc.updatedAt ?? new Date(),
		});
	}
}
