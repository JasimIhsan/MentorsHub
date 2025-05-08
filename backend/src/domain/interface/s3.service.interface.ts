export interface IS3Service {
	uploadFile(buffer: Buffer, fileName: string, mimeType: string, folder: string, userId?: string): Promise<string>;
	getSignedUrl(key: string, expiresIn: number): Promise<string>;
}
