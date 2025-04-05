export interface IUserDTO {
	id?: string;
	email: string;
	fullName: string;
	role: "user" | "mentor";
	avatar?: string | null;
	status: "blocked" | "unblocked";
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: string[] | null;
	sessionCompleted?: number;
	mentorDetailsId?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
}
