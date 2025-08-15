import { MentorProfileProps } from "../../../../domain/entities/mentor.detailes.entity";
import { UserEntityProps } from "../../../../domain/entities/user.entity";
import { IMentorDTO } from "../../../dtos/mentor.dtos";

export interface IUpdateMentorProfileUseCase {
	execute(userId: string, mentorData: Partial<MentorProfileProps>, userData: Partial<UserEntityProps>, newDocuments?: Express.Multer.File[], newAvatar?: Express.Multer.File): Promise<IMentorDTO>;
}
