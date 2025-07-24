import { Request, Response, NextFunction } from "express";
import { IUpdateMentorProfileUseCase } from "../../../application/interfaces/mentors/mentor.profile.interfaces";
import { logger } from "../../../infrastructure/utils/logger";

export class UpdateMentorProfileController {
	constructor(private readonly updateMentorProfileUseCase: IUpdateMentorProfileUseCase) {}

	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.params.userId;
			const { firstName, lastName, bio, professionalTitle, languages, primaryExpertise, skills, yearsExperience, workExperiences, educations, certifications, sessionFormat, pricing, hourlyRate, availability } = req.body;

			// Parse stringified fields with error handling
			let parsedData;
			try {
				parsedData = {
					languages: languages ? JSON.parse(languages) : [],
					skills: skills ? JSON.parse(skills) : [],
					workExperiences: workExperiences ? JSON.parse(workExperiences) : [],
					educations: educations ? JSON.parse(educations) : [],
					certifications: certifications ? JSON.parse(certifications) : [],
					availability: availability ? JSON.parse(availability) : {},
				};
			} catch (parseError) {
				logger.error("Error parsing JSON fields:", parseError);
				res.status(400).json({
					success: false,
					message: "Invalid JSON format in request body",
				});
				return;
			}

			// Extract files correctly
			let avatar: Express.Multer.File | undefined;
			let documents: Express.Multer.File[] = [];

			if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
				const filesObject = req.files as { [fieldname: string]: Express.Multer.File[] };

				// Extract avatar
				if (filesObject["avatar"] && filesObject["avatar"][0]) {
					avatar = filesObject["avatar"][0];
				}

				// Extract documents
				if (filesObject["documents"]) {
					documents = filesObject["documents"];
				}
			}

			const mentor = await this.updateMentorProfileUseCase.execute(
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
					pricing: pricing === "paid" ? "paid" : "free",
					hourlyRate: pricing === "paid" ? parseFloat(hourlyRate) || 0 : 0,
					availability: parsedData.availability,
				},
				{
					firstName,
					lastName,
					bio,
					skills: parsedData.skills,
				},
				documents,
				avatar
			);

			res.status(200).json({
				success: true,
				message: "Mentor profile and user details updated successfully",
				mentor,
			});
		} catch (err) {
			logger.error(`❌ Error in UpdateMentorProfileController: ${err}`);
			console.error(`❌ Error in UpdateMentorProfileController:`, err);
			next(err);
		}
	}
}
