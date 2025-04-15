import s3 from "./s3.config";
import { v4 as uuid } from "uuid";

export const uploadFileToS3 = async (fileBuffer: Buffer, fileName: string, mimeType: string, keyPrefix: string = ""): Promise<string> => {
	const uniqueFileName = `${uuid()}-${fileName}`;

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME as string, // mentors-hub-documents
		Key: `${keyPrefix}${uniqueFileName}`, // mentor-documents/uuid-resume.pdf
		Body: fileBuffer,
		ContentType: mimeType,
	};

	const data = await s3.upload(params).promise();
	return data.Location;
};
