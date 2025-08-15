import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";
import { ICloudinaryService } from "../../../application/interfaces/usecases/user/user.profile.usecase.interfaces";
import { CloudinaryConfig } from "./config/cloudinary.config";

dotenv.config();

export class CloudinaryService implements ICloudinaryService {
	private isConfigured = false;

	private configureCloudinary() {
		if (!this.isConfigured) {
			cloudinary.config({
				cloud_name: CloudinaryConfig.CLOUDINARY_CLOUD_NAME,
				api_key: CloudinaryConfig.CLOUDINARY_API_KEY,
				api_secret: CloudinaryConfig.CLOUDINARY_API_SECRET,
			});
		}
	}

	async uploadProfilePicture(file: Express.Multer.File): Promise<string> {
		// configure cloudinary here to avoid construction the scretes are loaded
		this.configureCloudinary();

		return new Promise<string>((resolve, reject) => {
			if (!file.buffer) {
				return reject(new Error("No file buffer found"));
			}

			const uploadStream = cloudinary.uploader.upload_stream({ folder: "Profile Pictures" }, (error, result) => {
				if (error) {
					reject(new Error(`Cloudinary error: ${error.message}`));
				} else if (result) {
					resolve(result.secure_url); // Return the secure URL of the uploaded image
				} else {
					reject(new Error("Unknown Cloudinary error occurred"));
				}
			});

			const stream = Readable.from(file.buffer);
			stream.pipe(uploadStream);
		});
	}
}
