export interface IReviewerDTO {
	id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface IReviewDTO {
	id: string;
	reviewerId: IReviewerDTO;
	mentorId: string;
	sessionId: string;
	rating: number;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}
