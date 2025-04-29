import { Request, Response } from "express";
import { IBecomeMentorUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";

export class BecomeMentorController {
	constructor(private becomeMentorUseCase: IBecomeMentorUseCase) {}

	async handle(req: Request, res: Response) {
		try {
			const { userId, firstName, lastName, bio, professionalTitle, languages, primaryExpertise, skills, yearsExperience, workExperiences, educations, certifications, sessionFormat, sessionTypes, pricing, hourlyRate, availability, hoursPerWeek } =
				req.body;

			// Parse stringified fields
			const parsedData = {
				languages: JSON.parse(languages || "[]"),
				skills: JSON.parse(skills || "[]"),
				workExperiences: JSON.parse(workExperiences || "[]"),
				educations: JSON.parse(educations || "[]"),
				certifications: JSON.parse(certifications || "[]"),
				sessionTypes: JSON.parse(sessionTypes || "[]"),
				availability: JSON.parse(availability || "[]"),
			};

			// Normalize files to File[]
			let documents: Express.Multer.File[] = [];

			if (Array.isArray(req.files)) {
				documents = req.files as Express.Multer.File[];
			} else if (req.files && typeof req.files === "object") {
				Object.values(req.files).forEach((fileGroup) => {
					documents.push(...fileGroup);
				});
			}

			const mentorProfile = await this.becomeMentorUseCase.execute(
				userId,
				{
					userId,
					professionalTitle,
					primaryExpertise,
					languages: parsedData.languages,
					yearsExperience,
					workExperiences: parsedData.workExperiences,
					educations: parsedData.educations,
					certifications: parsedData.certifications,
					sessionFormat,
					sessionTypes: parsedData.sessionTypes,
					pricing,
					hourlyRate,
					availability: parsedData.availability,
				},
				{
					firstName,
					lastName,
					bio,
					skills: parsedData.skills,
				},
				documents
			);

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Mentor application submitted successfully",
				mentorProfile,
			});
		} catch (error: any) {
			console.error("Error in mentor application:", error.message);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
				success: false,
				message: error.message,
			});
		}
	}
}
