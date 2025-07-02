// src/application/use-cases/mentor/get.mentor.documents.usecase.ts
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IS3Service } from "../../../domain/interface/s3.service.interface";
import { IGetDocumentsUseCase } from "../../interfaces/documents";


interface Input {
	mentorId: string;
	user: any;
}

export class GetDocumentsUseCase implements IGetDocumentsUseCase{
	constructor(private mentorRepo: IMentorProfileRepository, private s3Service: IS3Service) {}

	async execute({ mentorId, user }: Input): Promise<string[]> {
		console.log('user: ', user);
		console.log(`mentorId: ${mentorId}`);	
		const mentor = await this.mentorRepo.findMentorByUserId(mentorId);
		if (!mentor) throw new Error("Mentor not found");

		const isAdmin = user.role === "admin" ? true : user.role === "super-admin" ? true : false;
		const isOwner = mentor.userId.toString() === user.id;
		
		console.log('isOwner: ', isOwner);
		console.log('isAdmin: ', isAdmin);

		if (!isOwner && !isAdmin) throw new Error("Access denied");

		const urls = await Promise.all(mentor.documents.map((key) => this.s3Service.getSignedUrl(key, 60 * 5)));
		console.log('urls: ', urls);
		return urls;
	}
}
