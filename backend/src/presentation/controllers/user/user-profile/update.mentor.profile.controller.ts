import { NextFunction, Request, Response } from "express";
import { IReApplyMentorApplicationUseCase } from "../../../../application/interfaces/user/user.profile.usecase.interfaces";
import { HttpStatusCode } from "../../../../shared/constants/http.status.codes";
import { logger } from "../../../../infrastructure/utils/logger";

export class ReApplyMentorApplicationController {
	constructor(private upsertMentorApplicationUseCase: IReApplyMentorApplicationUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId, firstName, lastName, bio, professionalTitle, languages, primaryExpertise, skills, yearsExperience, workExperiences, educations, certifications, sessionFormat, pricing, hourlyRate, availability } = req.body;

			// Parse stringified fields
			const parsedData = {
				languages: JSON.parse(languages || "[]"),
				skills: JSON.parse(skills || "[]"),
				workExperiences: JSON.parse(workExperiences || "[]"),
				educations: JSON.parse(educations || "[]"),
				certifications: JSON.parse(certifications || "[]"),
				availability: JSON.parse(availability || "{}"), // Changed to object to match Partial<Record<WeekDay, string[]>>
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

			const mentorProfile = await this.upsertMentorApplicationUseCase.execute(
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
				documents,
			);

			res.status(HttpStatusCode.OK).json({
				success: true,
				message: "Mentor application submitted successfully",
				mentorProfile,
			});
		} catch (error) {
			logger.error("Error in upsert mentor application:", error);
			next(error);
		}
	}
}

