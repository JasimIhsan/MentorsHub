import { CommonStringMessage } from "../../../../shared/constants/string.messages";
import { ICloudinaryService } from "../../../interfaces/usecases/user/user.profile.usecase.interfaces";

export class UploadAvatarUseCase {
	constructor(private uploader: ICloudinaryService) {}
	execute(userId: string, avatar: Express.Multer.File) {
		if (!userId) throw new Error(CommonStringMessage.USER_NOT_FOUND);
		const imageUrl = this.uploader.uploadProfilePicture(avatar);
		return imageUrl;
	}
}
