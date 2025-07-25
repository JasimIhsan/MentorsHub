import { UserEntity } from "../../domain/entities/user.entity";
import { MentorRequestStatusEnum } from "../interfaces/enums/mentor.request.status.enum";
import { RoleEnum } from "../interfaces/enums/role.enum";
import { UserStatusEnums } from "../interfaces/enums/user.status.enums";

export interface IUserDTO {
	id?: string;
	email: string;
	fullName: string;
	firstName: string;
	lastName: string;
	role: RoleEnum;
	avatar?: string | null;
	status: UserStatusEnums;
	bio?: string | null;
	interests?: string[] | null;
	skills?: string[] | null;
	badges?: string[] | null;
	averageRating: number | null;
	totalReviews: number | null;
	sessionCompleted?: number;
	mentorRequestStatus?: MentorRequestStatusEnum;
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
		mentorRequestStatus: entity.mentorRequestStatus,
		sessionCompleted: entity.sessionCompleted,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
	};
}
