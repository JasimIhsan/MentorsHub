import { Request, Response } from "express";
import { ICloudinaryService, IUpdateUserProfileUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";

export class UpdateUserProfileController {
	constructor(private updateUserProfileUseCase: IUpdateUserProfileUseCase, private uploadAvatarUseCase: ICloudinaryService) {}
	async handle(req: Request, res: Response) {
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

			console.log(`userId : `, userId);
			console.log("data: ", data);
			console.log("avatar: ", avatar);

			let user = null;
			if (avatar) {
				console.log(`have avatar`);
				const imageUrl = await this.uploadAvatarUseCase.uploadProfilePicture(avatar);
				user = await this.updateUserProfileUseCase.execute(userId, data, imageUrl);
			} else {
				user = await this.updateUserProfileUseCase.execute(data.userId, data);
			}

			res.status(200).json({ success: true, user });
		} catch (error) {
			console.log("error from update profile controller:  ", error);

			if (error instanceof Error) {
				res.status(500).json({ error: error.message });
			}
		}
	}
}
