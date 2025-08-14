import { IS3Service } from "../../../domain/interface/s3.service.interface";
import { UploadMentorDocumentInput } from "../../interfaces/usecases/documents";

export class UploadMentorDocumentUseCase {
	constructor(private s3Service: IS3Service) {}

	async execute(input: UploadMentorDocumentInput): Promise<string> {
		const folder = "mentor-certificates";
		const url = await this.s3Service.uploadFile(input.fileBuffer, input.fileName, input.mimeType, folder, input.mentorId);
		return url;
	}
}
