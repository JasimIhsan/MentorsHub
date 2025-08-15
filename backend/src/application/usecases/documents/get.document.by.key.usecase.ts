import { AdminEntity } from "../../../domain/entities/admin.entity";
import { UserEntity } from "../../../domain/entities/user.entity";
import { IS3Service } from "../../../domain/interface/s3.service.interface";
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { IGetDocumentByKeyUseCase } from "../../interfaces/usecases/documents";
import { RoleEnum } from "../../interfaces/enums/role.enum";

interface Input {
	mentorId: string;
	documentKey: string;
	user: UserEntity | AdminEntity;
}

export class GetDocumentByKeyUseCase implements IGetDocumentByKeyUseCase {
	constructor(private mentorRepo: IMentorProfileRepository, private s3Service: IS3Service) {}

	async execute({ mentorId, documentKey, user }: Input): Promise<string> {
		const mentor = await this.mentorRepo.findMentorByUserId(mentorId);
		if (!mentor) throw new Error("Mentor not found");

		const isAdmin = user.role === RoleEnum.ADMIN;
		const isOwner = mentor.userId.toString() === user.id;

		if (!isAdmin && !isOwner) throw new Error("Access denied");

		const hasDocument = mentor.documents.includes(documentKey);
		if (!hasDocument) throw new Error("Document not found");

		const signedUrl = await this.s3Service.getSignedUrl(documentKey, 60 * 5);
		return signedUrl;
	}
}
