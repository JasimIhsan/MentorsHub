// src/application/use-cases/mentor/get.mentor.documents.usecase.ts
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IS3Service } from "../../../domain/interface/s3.service.interface";
import { IGetDocumentsUseCase } from "../../interfaces/documents";
import { UserEntity } from "../../../domain/entities/user.entity";
import { AdminEntity } from "../../../domain/entities/admin.entity";

interface Input {
	mentorId: string;
	user: UserEntity | AdminEntity;
}

export class GetDocumentsUseCase implements IGetDocumentsUseCase {
	constructor(private mentorRepo: IMentorProfileRepository, private s3Service: IS3Service) {}

	async execute({ mentorId, user }: Input): Promise<string[]> {
		const mentor = await this.mentorRepo.findMentorByUserId(mentorId);
		if (!mentor) throw new Error("Mentor not found");

		const isAdmin = user.role === "admin" ? true : user.role === "super-admin" ? true : false;
		const isOwner = mentor.userId.toString() === user.id;

		if (!isOwner && !isAdmin) throw new Error("Access denied");

		const urls = await Promise.all(mentor.documents.map((key) => this.s3Service.getSignedUrl(key, 60 * 5)));
		return urls;
	}
}
