import { ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { IMentorDetails } from "./mentor.detailes.entity";

type UserRole = "user" | "mentor";
// interface IUserLocation {
// 	city: string | null;
// 	country: string | null;
// 	timezone: string | null;
//  }

// Interface representing the user structure
export interface UserInterface {
	id?: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	role?: UserRole;
	avatar?: string | null;
	status: 'blocked' | 'unblocked'
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: ObjectId[] | null;
	sessionCompleted?: number;
	// location?: IUserLocation;
	mentorDetailsId?: ObjectId | null;
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
	private status : 'blocked' | 'unblocked'
	private skills?: string[] | null;
	private badges?: ObjectId[] | null;
	private sessionCompleted?: number;
	private location?: Location;
	private mentorDetailsId?: ObjectId | null;
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
		this.status = user.status || 'unblocked'
		this.avatar = user.avatar ?? null;
		this.bio = user.bio ?? null;
		this.interests = user.interests ?? null;
		this.skills = user.skills ?? null;
		this.badges = user.badges ?? null;
		this.sessionCompleted = user.sessionCompleted ?? 0;
		// this.location = user.location as IUserLocation ?? { city: null, country: null, timezone: null } as IUserLocation;
		this.mentorDetailsId = user.mentorDetailsId ?? null;
		this.googleId = user.googleId ?? null;
		this.createdAt = user.createdAt ?? new Date();
		this.updatedAt = user.updatedAt ?? null;
	}

	// Static method to create a new user with hashed password

	static async create(email: string, password: string, firstName: string, lastName: string): Promise<UserEntity> {
		const hashedPassword = await bcrypt.hash(password, 10);
		return new UserEntity({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			status: 'unblocked',
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
			status: 'unblocked',
			sessionCompleted: 0,
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
			status: userDoc.status || 'unblocked',
			googleId: userDoc.googleId ?? null,
			// location: userDoc.location ?? { city: null, country: null, timezone: null },
			mentorDetailsId: userDoc.mentorDetails ?? {},
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
		console.log("plainPassword: ", plainPassword);
		console.log("this.password: ", this.password);

		return bcrypt.compare(plainPassword, this.password);
	}

	// Update user details
	updateUserDetails(updatedData: Partial<UserInterface>) {
		console.log("pasword before: ", this.password);

		if (updatedData.password !== undefined) this.password = updatedData.password;
		if (updatedData.email !== undefined) this.email = updatedData.email;
		if (updatedData.firstName !== undefined) this.firstName = updatedData.firstName;
		if (updatedData.lastName !== undefined) this.lastName = updatedData.lastName;
		if (updatedData.avatar !== undefined) this.avatar = updatedData.avatar;
		if (updatedData.bio !== undefined) this.bio = updatedData.bio;
		if (updatedData.interests !== undefined) this.interests = updatedData.interests;
		if (updatedData.skills !== undefined) this.skills = updatedData.skills;
		if (updatedData.badges !== undefined) this.badges = updatedData.badges;
		if (updatedData.sessionCompleted !== undefined) this.sessionCompleted = updatedData.sessionCompleted;
		if (updatedData.mentorDetailsId !== undefined) this.mentorDetailsId = updatedData.mentorDetailsId;

		this.updatedAt = new Date();
		console.log("pasword after : ", this.password);
	}

	// Toggle active status
	toggleActiveStatus(status: boolean) {
		this.updatedAt = new Date();
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

	getName(): string {
		return `${this.firstName} ${this.lastName}`;
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
			// location: this.location,
			mentorDetailsId: this.mentorDetailsId,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...(includePassword ? { password: this.password } : {}),
		};
	}
}
