import { ICloudinaryService } from "../../../interfaces/user/user.profile.usecase.interfaces";

export class UploadAvatarUseCase {
	constructor(private uploader: ICloudinaryService) {}
	execute(userId: string, avatar: Express.Multer.File) {
		if (!userId) throw new Error("User not found");
		const imageUrl = this.uploader.uploadProfilePicture(avatar);
		return imageUrl;
	}
}
