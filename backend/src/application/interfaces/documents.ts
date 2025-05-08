import { AdminEntity } from "../../domain/entities/admin.entity";
import { UserEntity } from "../../domain/entities/user.entity";

export interface UploadMentorDocumentInput {
	fileBuffer: Buffer;
	fileName: string;
	mimeType: string;
	mentorId: string;
}

export interface IUploadMentorDocuments {
	execute(input: UploadMentorDocumentInput): Promise<string>;
}

export interface IGetDocumentsUseCase {
	execute({ mentorId, user }: { mentorId: string; user: UserEntity | AdminEntity }): Promise<string[]>;
}
