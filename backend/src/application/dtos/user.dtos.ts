// user.dto.ts
import { ObjectId } from "mongoose";
import { UserEntity } from "../../domain/entities/user.entity";

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
	badges?: ObjectId[] | null;
	sessionCompleted?: number;
	mentorDetailsId?: ObjectId | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class UserDTO implements IUserDTO {
	id?: string;
	email: string;
	fullName: string;
	role: "user" | "mentor";
	avatar?: string | null;
	bio?: string | null;
	status: "blocked" | "unblocked";
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: ObjectId[] | null;
	sessionCompleted?: number;
	mentorDetailsId?: ObjectId | null;
	createdAt: Date;
	updatedAt?: Date | null;

	constructor(
		id: string | undefined,
		email: string,
		fullName: string,
		role: "user" | "mentor",
		avatar: string,
		bio: string | null,
		status: "blocked" | "unblocked",
		interests: string[] | null,
		skills: string[] | null,
		badges: ObjectId[] | null,
		sessionCompleted: number,
		mentorDetailsId: ObjectId | null,
		createdAt: Date,
		updatedAt: Date | null
	) {
		this.id = id;
		this.email = email;
		this.fullName = fullName;
		this.role = role;
		this.avatar = avatar ?? "";
		this.bio = bio;
		this.status = status;
		this.interests = interests;
		this.skills = skills;
		this.badges = badges;
		this.sessionCompleted = sessionCompleted;
		this.mentorDetailsId = mentorDetailsId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}

	static fromEntity(user: UserEntity): UserDTO {
		const profile = user.getProfile();

		return new UserDTO(
			user.getId(),
			user.getEmail(),
			user.getName(),
			user.getRole(),
			profile.avatar ?? "",
			profile.bio ?? null,
			profile.status ?? "unblocked",
			profile.interests ?? null,
			profile.skills ?? null,
			profile.badges ?? null,
			profile.sessionCompleted ?? 0,
			profile.mentorDetailsId ?? null,
			profile.createdAt!,
			profile.updatedAt ?? null
		);
	}
}
