export interface IUserDTO {
	id?: string;
	email: string;
	fullName: string;
	firstName: string;
	lastName: string;
	role: "user" | "mentor";
	avatar?: string | null;
	status: "blocked" | "unblocked";
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: string[] | null;
	averageRating: number | null;
	totalReviews: number | null;
	sessionCompleted?: number;
	mentorRequestStatus?: "pending" | "approved" | "rejected" | "not-requested";
	createdAt: Date;
	updatedAt?: Date | null;
}
