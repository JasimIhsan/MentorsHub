export interface UserInterface {
	id?: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role?: "user" | "mentor";
	avatar?: string | null;
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	isActive?: boolean | null;
	location?: {
	  city: string | null;
	  country: string | null;
	  timezone: string | null;
	};
	createdAt?: Date;
	updatedAt?: Date | null;
	lastActive?: Date | null;
	isVerified?: boolean | null;
	mentorProfileId?: string | null; // Assuming ObjectId is a string in TS
	mentorRequestStatus?: string | null;
	rating?: number | null;
	sessionCompleted?: number | null;
	featuredMentor?: boolean | null;
	badges?: string[] | null; // Assuming ObjectId[] as string[]
 }