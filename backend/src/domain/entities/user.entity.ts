import { ObjectId } from "mongoose";
import bcrypt from "bcrypt";

// Interface representing the user structure
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
	isActive: boolean;
	location?: { city: string | null; country: string | null; timezone: string | null };
	createdAt?: Date;
	updatedAt?: Date | null;
	lastActive?: Date | null;
	isVerified?: boolean;
	mentorProfileId?: ObjectId | null;
	mentorRequestStatus?: string | null;
	rating?: number | null;
	sessionCompleted?: number | null;
	featuredMentor?: boolean | null;
	badges?: ObjectId[] | null;
	resetPasswordToken?: string | null;
	resetPasswordExpires?: number | null;
}

type UserRole = "user" | "mentor";

class BaseEntity {
	constructor(protected id?: string, protected createdAt: Date = new Date(), protected updatedAt: Date | null = null) {}

	getId(): string | undefined {
		return this.id;
	}
}

export class UserEntity extends BaseEntity {
	private isActive: boolean;
	private role: UserRole;

	constructor(private user: UserInterface) {
		super(user.id, user.createdAt, user.updatedAt);
		this.isActive = user.isActive ?? true;
		this.role = user.role || "user";
	}

	static async create(email: string, password: string, firstName: string, lastName: string) {
		const hashedPassword = await bcrypt.hash(password, 10);
		return new UserEntity({ email, password: hashedPassword, firstName, lastName, isActive: true });
	}

	// Convert MongoDB user document to UserEntity (For existing users)
	static fromDBDocument(userDoc: any): UserEntity {
		console.log(`fromDBDocument`);
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
			isActive: userDoc.isActive ?? true,
			location: userDoc.location ?? { city: null, country: null, timezone: null },
			createdAt: userDoc.createdAt ?? new Date(),
			updatedAt: userDoc.updatedAt ?? null,
			lastActive: userDoc.lastActive ?? null,
			isVerified: userDoc.isVerified ?? false,
			mentorProfileId: userDoc.mentorProfileId ?? null,
			mentorRequestStatus: userDoc.mentorRequestStatus ?? null,
			rating: userDoc.rating ?? null,
			sessionCompleted: userDoc.sessionCompleted ?? null,
			featuredMentor: userDoc.featuredMentor ?? null,
			badges: userDoc.badges ?? null,
			resetPasswordToken: userDoc.resetPasswordToken ?? null,
			resetPasswordExpires: userDoc.resetPasswordExpires ?? null,
		});
	}

	static async hashPassword(password: string) {
		return bcrypt.hash(password, 10);
	}

	async isPasswordValid(plainPassword: string) {
		return bcrypt.compare(plainPassword, this.user.password);
	}

	updateUserDetails(updatedData: Partial<UserInterface>) {
		this.user = { ...this.user, ...updatedData, updatedAt: new Date() };
	}

	toggleActiveStatus(status: boolean) {
		this.isActive = status;
		this.user.isActive = status;
		this.user.updatedAt = new Date();
	}

	verifyUser() {
		this.user.isVerified = true;
		this.user.updatedAt = new Date();
	}

	setPasswordResetToken(token: string, expiresIn: number) {
		this.user.resetPasswordToken = token;
		this.user.resetPasswordExpires = Date.now() + expiresIn;
	}

	getEmail() {
		return this.user.email;
	}

	getRole() {
		return this.role;
	}

	getName() {
		return `${this.user.firstName} ${this.user.lastName}`;
	}

	getProfile(): Partial<UserInterface> {
		return { ...this.user, isActive: this.isActive, role: this.role };
	}
}
