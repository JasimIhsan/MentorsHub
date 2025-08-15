import { IS3Service } from "../../../domain/interface/s3.service.interface";
import s3 from "./s3.instance";
import { v4 as uuid } from "uuid";

export class S3Service implements IS3Service {
	async uploadFile(buffer: Buffer, fileName: string, mimeType: string, folder: string, userId?: string): Promise<string> {
		const uniqueFileName = `${uuid()}-${fileName}`;
		const keyPrefix = userId ? `${folder}/${userId}/` : `${folder}/`;
		const fullKey = `${keyPrefix}${uniqueFileName}`;

		const params = {
			Bucket: process.env.AWS_BUCKET_NAME as string,
			Key: fullKey,
			Body: buffer,
			ContentType: mimeType,
		};

		await s3.upload(params).promise();
		return fullKey;
	}

	async getSignedUrl(key: string, expiresIn: number): Promise<string> {
		const params = {
			Bucket: process.env.AWS_BUCKET_NAME as string,
			Key: key,
			Expires: expiresIn,
		};
		return s3.getSignedUrlPromise("getObject", params);
	}
}
