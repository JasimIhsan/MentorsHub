import { Request, Response } from "express";
import { ICloudinaryService, IUpdateUserProfileUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class UpdateUserProfileController {
	constructor(private updateUserProfileUseCase: IUpdateUserProfileUseCase, private uploadAvatarUseCase: ICloudinaryService) {}
	async handle(req: Request, res: Response) {
		try {
			const { userId, firstName, lastName, email, skills, interests, bio } = req.body;
			const avatar = req.file;

			console.log(`UserId in controller : `, userId);

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

			console.log("user: ", user);

			res.status(HttpStatusCode.OK).json({ success: true, user });
		} catch (error) {
			console.log("error from update profile controller:  ", error);

			if (error instanceof Error) {
				res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
			}
		}
	}
}
