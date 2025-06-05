export interface ReviewerDTO {
	id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface ReviewDTO {
	id: string;
	reviewerId: ReviewerDTO;
	mentorId: string;
	sessionId: string;
	rating: number;
	comment: string;
	createdAt: Date;
	updatedAt: Date;
}
