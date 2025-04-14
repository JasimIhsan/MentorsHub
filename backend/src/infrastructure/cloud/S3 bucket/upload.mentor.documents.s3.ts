import { uploadFileToS3 } from "./upload.to.s3";

/**
 * Uploads mentor document to S3 and returns the public URL.
 *
 * @param fileBuffer - The buffer of the file
 * @param fileName - Original name of the file
 * @param mimeType - File MIME type (e.g. 'application/pdf')
 * @param mentorId - Optional: Used to organize files
 * @returns URL string of uploaded file
 */
export const uploadMentorDocument = async (fileBuffer: Buffer, fileName: string, mimeType: string, mentorId?: string): Promise<string> => {
	const folder = "mentor-certificates";
	const keyPrefix = mentorId ? `${folder}/${mentorId}/` : `${folder}/`;

	const s3Url = await uploadFileToS3(fileBuffer, fileName, mimeType, keyPrefix);

	return s3Url;
};
