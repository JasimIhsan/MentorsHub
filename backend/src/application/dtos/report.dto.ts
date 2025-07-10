import { ReportEntity } from "../../domain/entities/report.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { ReportStatusEnum } from "../interfaces/enums/report.status.enum";
import { UserStatusEnums } from "../interfaces/enums/user.status.enums";

export interface IReportDTO {
	id: string;
	reporter: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
	};
	reported: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
		status: UserStatusEnums;
	};
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
			status: reported.status,
		},
		reason: entity.reason,
		status: entity.status,
		adminNote: entity.adminNote,
		createdAt: entity.createdAt,
	};
}
