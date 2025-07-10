import { ReportEntity } from "../../domain/entities/report.entity";
import { PersonEntity } from "../../domain/entities/session.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { ReportStatusEnum } from "../interfaces/enums/report.status.enum";

export interface IReportDTO {
	id: string;
	reporter: PersonEntity;
	reported: PersonEntity;
	reason: string;
	status: ReportStatusEnum;
	adminNote?: string;
	createdAt: Date;
}

export function mapToReportDTO(entity: ReportEntity, reporter: UserEntity, reported: UserEntity): IReportDTO {
	return {
		id: entity.id,
		reporter: {
			id: reporter.id!,
			firstName: reporter.firstName,
			lastName: reporter.lastName,
			avatar: reporter.avatar || undefined,
		},
		reported: {
			id: reported.id!,
			firstName: reported.firstName,
			lastName: reported.lastName,
			avatar: reported.avatar || undefined,
		},
		reason: entity.reason,
		status: entity.status,
		adminNote: entity.adminNote,
		createdAt: entity.createdAt,
	};
}
