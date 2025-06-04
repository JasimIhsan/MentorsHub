import { ObjectId } from "mongoose";
import bcrypt from "bcrypt";
// import { IMentorInterface } from "./mentor.detailes.entity";

export type UserRole = "user" | "mentor";

// Interface representing the user structure
export interface UserInterface {
	id?: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	role?: UserRole;
	avatar?: string | null;
	status: "blocked" | "unblocked";
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: ObjectId[] | null;
	sessionCompleted?: number;
	averageRating: number | null;
	totalReviews: number | null;
	mentorRequestStatus: "pending" | "approved" | "rejected" | "not-requested";
	googleId?: string | null;
	createdAt?: Date;
	updatedAt?: Date | null;
}

// UserEntity Class
export class UserEntity {
	private id?: string;
	private email: string;
	private firstName: string;
	private lastName: string;
	private password: string;
	private role: UserRole;
	private avatar?: string | null;
	private bio?: string | null;
	private interests?: string[] | null;
	private status: "blocked" | "unblocked";
	private skills?: string[] | null;
	private badges?: ObjectId[] | null;
	private sessionCompleted?: number;
	private averageRating: number | null;
	private totalReviews: number | null;
	private mentorRequestStatus: "pending" | "approved" | "rejected" | "not-requested";
	private googleId?: string | null;
	private createdAt: Date;
	private updatedAt?: Date | null;

	constructor(user: UserInterface) {
		this.id = user.id;
		this.email = user.email;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.password = user.password;
		this.role = user.role || "user";
		this.status = user.status || "unblocked";
		this.avatar = user.avatar ?? null;
		this.bio = user.bio ?? null;
		this.interests = user.interests ?? null;
		this.skills = user.skills ?? null;
		this.badges = user.badges ?? null;
		this.averageRating = user.averageRating ?? null;
		this.totalReviews = user.totalReviews ?? null;
		this.sessionCompleted = user.sessionCompleted ?? 0;
		this.mentorRequestStatus = user.mentorRequestStatus || "not-requested";
		this.googleId = user.googleId ?? null;
		this.createdAt = user.createdAt ?? new Date();
		this.updatedAt = user.updatedAt ?? null;
	}

	// Static method to create a new user with hashed password

	static async create(email: string, password: string, firstName: string, lastName: string, role: UserRole = "user"): Promise<UserEntity> {
		const hashedPassword = await bcrypt.hash(password, 10);
		return new UserEntity({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			status: "unblocked",
			mentorRequestStatus: "not-requested",
			role,
			averageRating: 0,
			totalReviews: 0,
			sessionCompleted: 0,
			createdAt: new Date(),
		});
	}

	static async createWithGoogle(email: string, password: string, firstName: string, lastName: string, googleId: string, avatar: string): Promise<UserEntity> {
		const hashedPassword = await bcrypt.hash(password, 10);
		return new UserEntity({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			status: "unblocked",
			sessionCompleted: 0,
			averageRating: 0,
			totalReviews: 0,
			mentorRequestStatus: "not-requested",
			googleId: googleId ?? null,
			avatar,
			createdAt: new Date(),
		});
	}

	// Convert MongoDB user document to UserEntity
	static fromDBDocument(userDoc: any): UserEntity {
		return new UserEntity({
			id: userDoc._id?.toString(),
			email: userDoc.email,
			password: userDoc.password,
			firstName: userDoc.firstName,
			lastName: userDoc.lastName,
			role: userDoc.role || "user",
			avatar: userDoc.avatar ?? null,
			bio: userDoc.bio ?? null,
			interests: userDoc.interests ?? null,
			skills: userDoc.skills ?? null,
			status: userDoc.status || "unblocked",
			averageRating: userDoc.averageRating ?? null,
			totalReviews: userDoc.totalReviews ?? null,
			googleId: userDoc.googleId ?? null,
			mentorRequestStatus: userDoc.mentorRequestStatus || "not-requested",
			sessionCompleted: userDoc.sessionCompleted ?? 0,
			badges: userDoc.badges ?? null,
			createdAt: userDoc.createdAt ?? new Date(),
			updatedAt: userDoc.updatedAt ?? null,
		});
	}

	// Hash password
	static async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, 10);
	}

	// Validate password
	async isPasswordValid(plainPassword: string): Promise<boolean> {
		return bcrypt.compare(plainPassword, this.password);
	}

	// Update user details
	updateUserDetails(updatedData: Partial<UserInterface>) {
		if (updatedData.password !== undefined) this.password = updatedData.password;
		if (updatedData.email !== undefined) this.email = updatedData.email;
		if (updatedData.firstName !== undefined) this.firstName = updatedData.firstName;
		if (updatedData.lastName !== undefined) this.lastName = updatedData.lastName;
		if (updatedData.role !== undefined) this.role = updatedData.role;
		if (updatedData.avatar !== undefined) this.avatar = updatedData.avatar;
		if (updatedData.bio !== undefined) this.bio = updatedData.bio;
		if (updatedData.interests !== undefined) this.interests = updatedData.interests;
		if (updatedData.skills !== undefined) this.skills = updatedData.skills;
		if (updatedData.badges !== undefined) this.badges = updatedData.badges;
		if (updatedData.sessionCompleted !== undefined) this.sessionCompleted = updatedData.sessionCompleted;
		if (updatedData.mentorRequestStatus !== undefined) {
			this.mentorRequestStatus = updatedData.mentorRequestStatus;
		}
		this.updatedAt = new Date();
	}

	// Toggle active status
	toggleStatus(status: "blocked" | "unblocked") {
		this.status = status;
	}

	// Getters
	getId(): string | undefined {
		return this.id;
	}

	getEmail(): string {
		return this.email;
	}

	getRole(): UserRole {
		return this.role;
	}

	getFullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	getFirstName(): string {
		return this.firstName;
	}

	getLastName(): string {
		return this.lastName;
	}

	getStatus(): "blocked" | "unblocked" {
		return this.status;
	}

	getrating(): number | null {
		return this.averageRating;
	}

	getTotalReviews(): number | null {
		return this.totalReviews;
	}

	getProfile(includePassword: boolean = false): Partial<UserInterface> {
		return {
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			role: this.role,
			avatar: this.avatar,
			status: this.status,
			bio: this.bio,
			interests: this.interests,
			skills: this.skills,
			badges: this.badges,
			sessionCompleted: this.sessionCompleted,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			mentorRequestStatus: this.mentorRequestStatus,
			...(includePassword ? { password: this.password } : {}),
		};
	}

	getMentorRequestStatus(): "pending" | "approved" | "rejected" | "not-requested" {
		return this.mentorRequestStatus;
	}
}
