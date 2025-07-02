// src/infrastructure/cloud/s3/s3.config.ts
export class S3Config {
	static AWS_ACCESS_KEY_ID: string;
	static AWS_SECRET_ACCESS_KEY: string;

	static init(secrets: { AWS_ACCESS_KEY_ID: string; AWS_SECRET_ACCESS_KEY: string }) {
		this.AWS_ACCESS_KEY_ID = secrets.AWS_ACCESS_KEY_ID;
		this.AWS_SECRET_ACCESS_KEY = secrets.AWS_SECRET_ACCESS_KEY;
	}
}
