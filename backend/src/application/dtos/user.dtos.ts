// user.dto.ts
import { ObjectId } from "mongoose";
import { UserEntity } from "../../domain/entities/user.entity";

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
	badges?: ObjectId[] | null;
	averageRating: number | null;
	totalReviews: number | null;
	sessionCompleted?: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class UserDTO implements IUserDTO {
	id?: string;
	email: string;
	fullName: string;
	firstName: string;
	lastName: string;
	role: "user" | "mentor";
	avatar?: string | null;
	bio?: string | null;
	status: "blocked" | "unblocked";
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: ObjectId[] | null;
	sessionCompleted?: number;
	averageRating: number | null;
	totalReviews: number | null;
	createdAt: Date;
	updatedAt?: Date | null;

	constructor(
		id: string | undefined,
		email: string,
		fullName: string,
		firstName: string,
		lastName: string,
		role: "user" | "mentor",
		avatar: string,
		bio: string | null,
		status: "blocked" | "unblocked",
		interests: string[] | null,
		skills: string[] | null,
		badges: ObjectId[] | null,
		sessionCompleted: number,
		averageRating: number | null,
		totalReviews: number | null,
		createdAt: Date,
		updatedAt: Date | null
	) {
		this.id = id;
		this.email = email;
		this.fullName = fullName;
		this.firstName = firstName;
		this.lastName = lastName;
		this.role = role;
		this.avatar = avatar ?? "";
		this.bio = bio;
		this.status = status;
		this.interests = interests;
		this.skills = skills;
		this.badges = badges;
		this.averageRating = averageRating;
		this.totalReviews = totalReviews;
		this.sessionCompleted = sessionCompleted;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	static fromEntity(user: UserEntity): UserDTO {
		const profile = user.getProfile();

		return new UserDTO(
			user.getId(),
			user.getEmail(),
			user.getFullName(),
			user.getFirstName(),
			user.getLastName(),
			user.getRole(),
			profile.avatar ?? "",
			profile.bio ?? null,
			profile.status ?? "unblocked",
			profile.interests ?? null,
			profile.skills ?? null,
			profile.badges ?? null,
			user.getrating() ?? 0,
			user.getTotalReviews() ?? 0,
			profile.sessionCompleted ?? 0,
			profile.createdAt!,
			profile.updatedAt ?? null
		);
	}
}
