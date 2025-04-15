import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";
import { ICloudinaryService } from "../../../application/interfaces/user/user.profile.usecase.interfaces";

dotenv.config();

export class CloudinaryService implements ICloudinaryService {
	uploader: any;
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_NAME as string,
			api_key: process.env.CLOUDINARY_API_KEY as string,
			api_secret: process.env.CLOUDINARY_API_SECRET as string,
		});
	}

	async uploadProfilePicture(file: Express.Multer.File): Promise<string> {
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
