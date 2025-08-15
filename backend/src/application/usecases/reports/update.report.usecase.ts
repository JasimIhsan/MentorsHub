import { IReportRepository } from "../../../domain/repositories/report.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IReportDTO, mapToReportDTO } from "../../dtos/report.dto";
import { ReportStatusEnum } from "../../interfaces/enums/report.status.enum";
import { UserStatusEnums } from "../../interfaces/enums/user.status.enums";
import { IUpdateReportStatusUseCase } from "../../interfaces/usecases/reports";

export class UpdateReportStatusUseCase implements IUpdateReportStatusUseCase {
	constructor(private readonly _reportRepo: IReportRepository, private readonly _userRepo: IUserRepository) {}

	async execute(reportId: string, action: "dismiss" | "block", adminNote?: string): Promise<IReportDTO> {
		const reportEntity = await this._reportRepo.findById(reportId);
		if (!reportEntity) throw new Error("Report not found");

		let updatedReportEntity = reportEntity;

		// Dismiss report with optional admin note
		if (action === "dismiss") {
			updatedReportEntity = reportEntity.updateReport({
				status: ReportStatusEnum.DISMISSED,
				adminNote: adminNote || reportEntity.adminNote,
			});
			await this._reportRepo.update(updatedReportEntity);
		}

		// Block reported user and mark all their reports as resolved
		if (action === "block") {
			// 1. Mark this report as ACTION_TAKEN
			updatedReportEntity = reportEntity.updateReport({
				status: ReportStatusEnum.ACTION_TAKEN,
			});
			await this._reportRepo.update(updatedReportEntity);

			// 2. Block the reported user
			const user = await this._userRepo.findUserById(reportEntity.reportedId);
			if (!user) throw new Error("Reported user not found");

			user.toggleStatus(UserStatusEnums.BLOCKED);
			await this._userRepo.updateUser(user.id!, user);

			// 3. Mark all other pending reports against this user as resolved
			await this._reportRepo.updateReportsByReportedId(user.id!, ReportStatusEnum.ACTION_TAKEN);
		}

		// Return latest updated report with reporter and reported user
		const reporter = await this._userRepo.findUserById(reportEntity.reporterId);
		const reported = await this._userRepo.findUserById(reportEntity.reportedId);
		if (!reporter || !reported) throw new Error("User data missing");

		return mapToReportDTO(updatedReportEntity, reporter, reported);
	}
}
