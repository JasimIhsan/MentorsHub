import { MentorRequestStatusEnum } from "../../application/interfaces/enums/mentor.request.status.enum";
import { RoleEnum } from "../../application/interfaces/enums/role.enum";
import { UserStatusEnums } from "../../application/interfaces/enums/user.status.enums";


export interface UserEntityProps {
	id?: string;
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	role?: RoleEnum;
	avatar?: string | null;
	status?: UserStatusEnums;
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: string[] | null;
	sessionCompleted?: number;
	averageRating?: number | null;
	totalReviews?: number | null;
	mentorRequestStatus?: MentorRequestStatusEnum;
	googleId?: string | null;
	createdAt?: Date;
	updatedAt?: Date | null;
}

export class UserEntity {
	private _id?: string;
	private _email: string;
	private _firstName: string;
	private _lastName: string;
	private _password: string;
	private _role: RoleEnum;
	private _avatar?: string | null;
	private _bio?: string | null;
	private _interests?: string[] | null;
	private _skills?: string[] | null;
	private _badges?: string[] | null;
	private _sessionCompleted: number;
	private _averageRating: number | null;
	private _totalReviews: number | null;
	private _status: UserStatusEnums;
	private _mentorRequestStatus: MentorRequestStatusEnum;
	private _googleId?: string | null;
	private _createdAt: Date;
	private _updatedAt: Date | null;

	constructor(user: UserEntityProps) {
		this._id = user.id;
		this._email = user.email;
		this._firstName = user.firstName;
		this._lastName = user.lastName;
		this._password = user.password;
		this._role = user.role ?? RoleEnum.USER;
		this._status = user.status ?? UserStatusEnums.UNBLOCKED;
		this._avatar = user.avatar ?? null;
		this._bio = user.bio ?? null;
		this._interests = user.interests ?? null;
		this._skills = user.skills ?? null;
		this._badges = user.badges ?? null;
		this._sessionCompleted = user.sessionCompleted ?? 0;
		this._averageRating = user.averageRating ?? null;
		this._totalReviews = user.totalReviews ?? null;
		this._mentorRequestStatus = user.mentorRequestStatus ?? MentorRequestStatusEnum.NOT_REQUESTED;
		this._googleId = user.googleId ?? null;
		this._createdAt = user.createdAt ?? new Date();
		this._updatedAt = user.updatedAt ?? null;
	}

	// ── Accessors ────────────────────────
	get id(): string | undefined {
		return this._id;
	}

	get email(): string {
		return this._email;
	}

	get firstName(): string {
		return this._firstName;
	}

	get lastName(): string {
		return this._lastName;
	}

	get fullName(): string {
		return `${this._firstName} ${this._lastName}`;
	}

	get password(): string {
		return this._password;
	}

	get role(): RoleEnum {
		return this._role;
	}

	get avatar(): string | null {
		return this._avatar ?? null;
	}

	get bio(): string | null {
		return this._bio ?? null;
	}

	get interests(): string[] | null {
		return this._interests ?? null;
	}

	get skills(): string[] | null {
		return this._skills ?? null;
	}

	get badges(): string[] | null {
		return this._badges ?? null;
	}

	get sessionCompleted(): number {
		return this._sessionCompleted;
	}

	get averageRating(): number | null {
		return this._averageRating;
	}

	get totalReviews(): number | null {
		return this._totalReviews;
	}

	get status(): UserStatusEnums {
		return this._status;
	}

	get mentorRequestStatus(): MentorRequestStatusEnum {
		return this._mentorRequestStatus;
	}

	get googleId(): string | null {
		return this._googleId ?? null;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date | null {
		return this._updatedAt;
	}

	// ── Business Logic ───────────────────────

	getFullName(): string {
		return `${this._firstName} ${this._lastName}`;
	}

	updateUserDetails(updated: Partial<UserEntityProps>): void {
		if (updated.password !== undefined) this._password = updated.password;
		if (updated.firstName !== undefined) this._firstName = updated.firstName;
		if (updated.lastName !== undefined) this._lastName = updated.lastName;
		if (updated.avatar !== undefined) this._avatar = updated.avatar;
		if (updated.bio !== undefined) this._bio = updated.bio;
		if (updated.interests !== undefined) this._interests = updated.interests;
		if (updated.skills !== undefined) this._skills = updated.skills;
		if (updated.badges !== undefined) this._badges = updated.badges;
		if (updated.averageRating !== undefined) this._averageRating = updated.averageRating;
		if (updated.totalReviews !== undefined) this._totalReviews = updated.totalReviews;
		if (updated.sessionCompleted !== undefined) this._sessionCompleted = updated.sessionCompleted;
		if (updated.mentorRequestStatus !== undefined) this._mentorRequestStatus = updated.mentorRequestStatus;
		this._updatedAt = new Date();
	}

	toggleStatus(status: UserStatusEnums): void {
		this._status = status;
		this._updatedAt = new Date();
	}

	toObject(): UserEntityProps {
		return {
			id: this._id,
			email: this._email,
			firstName: this._firstName,
			lastName: this._lastName,
			password: this._password,
			role: this._role,
			avatar: this._avatar,
			bio: this._bio,
			interests: this._interests,
			skills: this._skills,
			badges: this._badges,
			sessionCompleted: this._sessionCompleted,
			averageRating: this._averageRating,
			totalReviews: this._totalReviews,
			status: this._status,
			mentorRequestStatus: this._mentorRequestStatus,
			googleId: this._googleId,
			createdAt: this._createdAt,
			updatedAt: this._updatedAt,
		};
	}
}
