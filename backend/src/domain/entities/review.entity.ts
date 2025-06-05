import { ReviewerDTO } from "../../application/dtos/review.dtos";
import { IReviewDocument } from "../../infrastructure/database/models/review-rating/review.model";

export interface IReviewEntity {
	id?: string;
	reviewerId: ReviewerDTO;
	mentorId: string;
	sessionId?: string;
	rating: number;
	comment: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export class ReviewEntity {
	private _id?: string;
	private reviewerId: ReviewerDTO;
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

	getReviewer(): ReviewerDTO {
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

	updateReviewData(data: Partial<IReviewEntity>): void {
		if(data.rating) this.updateRating(data.rating);
		if(data.comment) this.updateComment(data.comment);
		if(data.id) this._id = data.id;
		if(data.mentorId) this.mentorId = data.mentorId;
		if(data.sessionId) this.sessionId = data.sessionId;
		if(data.reviewerId?.avatar) this.reviewerId.avatar = data.reviewerId.avatar;
		if(data.reviewerId?.firstName) this.reviewerId.firstName = data.reviewerId.firstName;
		if(data.reviewerId?.lastName) this.reviewerId.lastName = data.reviewerId.lastName;
		if(data.reviewerId?.id) this.reviewerId.id = data.reviewerId.id;

	}


	static fromDBDocument(doc: IReviewDocument): ReviewEntity {
		const reviewer = doc.reviewerId as any; // populated reviewer

		const reviewerDto: ReviewerDTO = {
			id: reviewer._id?.toString(),
			firstName: reviewer.firstName,
			lastName: reviewer.lastName,
			avatar: reviewer.avatar ?? null,
		};

		return new ReviewEntity({
			id: doc._id?.toString(),
			reviewerId: reviewerDto,
			mentorId: doc.mentorId?.toString(),
			sessionId: doc.sessionId?.toString() ?? "",
			rating: doc.rating,
			comment: doc.comment,
			createdAt: doc.createdAt ?? new Date(),
			// updatedAt: doc.updatedAt ?? new Date(),
		});
	}
}
