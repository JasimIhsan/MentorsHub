import { ObjectId } from "mongoose";
import bcrypt from "bcrypt";

// Interface representing the structure of user
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
	mentorProfileId?: ObjectId | null;
	mentorRequestStatus?: string | null;
	rating?: number | null;
	sessionCompleted?: number | null;
	featuredMentor?: boolean | null;
	badges?: ObjectId[] | null;
}

type UserRole = "user" | "mentor";

// ✅ BaseEntity for common properties
class BaseEntity {
	protected id?: string;
	protected createdAt?: Date;
	protected updatedAt?: Date | null;

	constructor(id?: string, createdAt?: Date, updatedAt?: Date | null) {
		this.id = id;
		this.createdAt = createdAt || new Date();
		this.updatedAt = updatedAt || null;
	}

	public getId(): string | undefined {
		return this.id;
	}
}

// UserEntity with proper encapsulation
export class UserEntity extends BaseEntity {
	private email: string;
	private password: string;
	private firstName: string;
	private lastName: string;
	private role?: UserRole;
	private avatar?: string | null;
	private bio?: string | null;
	private interests?: string[] | null;
	private skills?: string[] | null;
	private isActive: boolean;
	private location?: {
		city: string | null;
		country: string | null;
		timezone: string | null;
	};
	private lastActive?: Date | null;
	private isVerified?: boolean | null;
	private mentorProfileId?: ObjectId | null;
	private mentorRequestStatus?: string | null;
	private rating?: number | null;
	private sessionCompleted?: number | null;
	private featuredMentor?: boolean | null;
	private badges?: ObjectId[] | null;

	// Private constructor to enforce controlled instance creation
	constructor(user: UserInterface) {
		super(user.id, user.createdAt, user.updatedAt);
		this.email = user.email;
		this.password = user.password;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.role = user.role || "user";
		this.avatar = user.avatar || null;
		this.bio = user.bio || null;
		this.interests = user.interests || null;
		this.skills = user.skills || null;
		this.isActive = user.isActive ?? true;
		this.location = user.location || { city: null, country: null, timezone: null };
		this.lastActive = user.lastActive || null;
		this.isVerified = user.isVerified || false;
		this.mentorProfileId = user.mentorProfileId || null;
		this.mentorRequestStatus = user.mentorRequestStatus || null;
		this.rating = user.rating || null;
		this.sessionCompleted = user.sessionCompleted || null;
		this.featuredMentor = user.featuredMentor || null;
		this.badges = user.badges || null;
	}

	// Factory method for creating a new UserEntity
	static async create(email: string, password: string, firstName: string, lastName: string) {
		const hashedPassword = await bcrypt.hash(password, 10);
		return new UserEntity({ email, password: hashedPassword, firstName, lastName });
	}

	// Password validation
	async isPasswordValid(plainPassword: string): Promise<boolean> {
		return await bcrypt.compare(plainPassword, this.password);
	}

	// Getters for accessing private fields safely
	public getEmail(): string {
		return this.email;
	}

	public getRole(): UserRole | undefined {
		return this.role;
	}

	public getName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	public getProfile(): Partial<UserInterface> {
		return {
			id: this.id,
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			role: this.role,
			avatar: this.avatar,
			bio: this.bio,
			interests: this.interests,
			skills: this.skills,
			isActive: this.isActive,
			isVerified: this.isVerified,
			mentorProfileId: this.mentorProfileId,
			mentorRequestStatus: this.mentorRequestStatus,
			rating: this.rating,
			sessionCompleted: this.sessionCompleted,
			featuredMentor: this.featuredMentor,
			badges: this.badges,
			location: this.location,
		};
	}
}
