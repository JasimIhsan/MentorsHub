import { Request, Response, NextFunction } from "express";
import { IGetSpecialSlotByMentorUseCase } from "../../../../../application/interfaces/usecases/mentors/mentor.availability.interfaces";
import { logger } from "../../../../../infrastructure/utils/logger";

export class GetSpecialSlotByMentorController {
	constructor(private readonly _useCase: IGetSpecialSlotByMentorUseCase) {}
	async handle(req: Request, res: Response, next: NextFunction) {
		try {
			const { mentorId } = req.params;
			const slots = await this._useCase.execute(mentorId);
			res.status(200).json({ success: true, slots });
		} catch (error) {
			logger.error(`❌ Error in GetSpecialSlotByMentorController: ${error}`);
			next(error);
		}
	}
}
