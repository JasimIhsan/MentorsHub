export class CloudinaryConfig {
	static CLOUDINARY_CLOUD_NAME: string;
	static CLOUDINARY_API_KEY: string;
	static CLOUDINARY_API_SECRET: string;

	static init(secrets: { CLOUDINARY_CLOUD_NAME: string; CLOUDINARY_API_KEY: string; CLOUDINARY_API_SECRET: string }) {
		this.CLOUDINARY_CLOUD_NAME = secrets.CLOUDINARY_CLOUD_NAME;
		this.CLOUDINARY_API_KEY = secrets.CLOUDINARY_API_KEY;
		this.CLOUDINARY_API_SECRET = secrets.CLOUDINARY_API_SECRET;
	}
}
