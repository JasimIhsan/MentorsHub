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

export interface Session {
	id: number;
	title: string;
	mentorName: string;
	mentorAvatar: string;
	date: string;
	time: string;
	type: "video" | "chat";
	isPaid: boolean;
}

export interface Notification {
	id: number;
	type: "reminder" | "availability" | "achievement" | "system";
	message: string;
	time: string;
	action: string;
}

export interface Mentor {
	id: number;
	name: string;
	expertise: string;
	avatar: string;
	tags: string[];
	sessionType: "video" | "chat";
	isPaid: boolean;
	rate?: string; // Optional, only present if isPaid is true
}
