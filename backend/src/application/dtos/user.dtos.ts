import { UserEntity } from "../../domain/entities/user.entity";
import { RoleEnum } from "../interfaces/enums/role";

export interface IUserDTO {
	id?: string;
	email: string;
	fullName: string;
	firstName: string;
	lastName: string;
	role: RoleEnum;
	avatar?: string | null;
	status: "blocked" | "unblocked";
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: string[] | null;
	averageRating: number | null;
	totalReviews: number | null;
	sessionCompleted?: number;
	createdAt: Date;
	updatedAt?: Date | null;
}

export function mapToUserDTO(entity: UserEntity): IUserDTO {
	return {
		id: entity.id,
		email: entity.email,
		fullName: `${entity.firstName} ${entity.lastName}`,
		firstName: entity.firstName,
		lastName: entity.lastName,
		role: entity.role,
		avatar: entity.avatar,
		status: entity.status,
		bio: entity.bio,
		interests: entity.interests,
		skills: entity.skills,
		badges: entity.badges,
		averageRating: entity.averageRating,
		totalReviews: entity.totalReviews,
		sessionCompleted: entity.sessionCompleted,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
	};
}
