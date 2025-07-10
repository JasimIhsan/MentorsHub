import { UserEntity } from "../../../domain/entities/user.entity";
import { IReportRepository } from "../../../domain/repositories/report.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IReportDTO, mapToReportDTO } from "../../dtos/report.dto";
import { IGetReportsUseCase } from "../../interfaces/reports";

export class GetReportsUsecase implements IGetReportsUseCase {
	constructor(private readonly _reportRepo: IReportRepository, private readonly _userRepo: IUserRepository) {}

	async execute(page: number, limit: number, search: string, status: string): Promise<{ reports: IReportDTO[]; totalCount: number }> {
		const reportEntities = await this._reportRepo.findAll(page, limit, search, status);

		const usersIds = new Set<string>();
		reportEntities.tasks.forEach((task) => {
			usersIds.add(task.reportedId);
			usersIds.add(task.reporterId);
		});

		const users = await this._userRepo.findUsersByIds([...usersIds]);
		const usersMap = new Map(users.map((u) => [u.id!, u]));

		const reportsDTO = reportEntities.tasks.map((task) => mapToReportDTO(task, usersMap.get(task.reporterId)!, usersMap.get(task.reportedId)!));

		return { reports: reportsDTO, totalCount: reportEntities.totalCount };
	}
}
