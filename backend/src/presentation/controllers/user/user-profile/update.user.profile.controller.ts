import { Request, Response, NextFunction } from "express";
import { ICloudinaryService, IUpdateUserProfileUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class UpdateUserProfileController {
	constructor(private updateUserProfileUseCase: IUpdateUserProfileUseCase, private uploadAvatarUseCase: ICloudinaryService) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, firstName, lastName, email, skills, interests, bio } = req.body;
			const avatar = req.file;

			const data = {
				userId,
				firstName,
				lastName,
				email,
				skills: JSON.parse(skills),
				interests: JSON.parse(interests),
				bio,
			};

			let user = null;

			if (avatar) {
				const imageUrl = await this.uploadAvatarUseCase.uploadProfilePicture(avatar);
				user = await this.updateUserProfileUseCase.execute(userId, data, imageUrl);
			} else {
				user = await this.updateUserProfileUseCase.execute(data.userId, data);
			}

			res.status(HttpStatusCode.OK).json({ success: true, user });
		} catch (error) {
			logger.error(`❌ Error in UpdateUserProfileController: ${error}`);
			next(error);
		}
	}
}
