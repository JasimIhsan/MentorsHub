import { ReportStatusEnum } from "../../application/interfaces/enums/report.status.enum";
import { IReportDocument } from "../../infrastructure/database/models/report/report.model";

export interface ReportProps {
	id: string;
	reporterId: string;
	reportedId: string;
	reason: string;
	status: ReportStatusEnum;
	adminNote?: string;
	createdAt: Date;
	updatedAt: Date;
}

export class ReportEntity {
	constructor(private props: ReportProps) {}

	get id(): string {
		return this.props.id;
	}

	get reporterId(): string {
		return this.props.reporterId;
	}

	get reportedId(): string {
		return this.props.reportedId;
	}

	get reason(): string {
		return this.props.reason;
	}

	get status(): ReportStatusEnum {
		return this.props.status;
	}

	get adminNote(): string | undefined {
		return this.props.adminNote;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	static createNew(input: Omit<ReportProps, "id" | "status" | "adminNote" | "createdAt" | "updatedAt">): ReportEntity {
		return new ReportEntity({
			id: "", // will be handled in DB
			reporterId: input.reporterId,
			reportedId: input.reportedId,
			reason: input.reason,
			status: ReportStatusEnum.PENDING,
			adminNote: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	static fromDbDocument = (doc: IReportDocument): ReportEntity => {
		return new ReportEntity({
			id: doc._id.toString(),
			reporterId: doc.reporterId.toString(),
			reportedId: doc.reportedId.toString(),
			reason: doc.reason,
			status: doc.status,
			adminNote: doc.adminNote,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	};

	updateReport(reportEntity: Partial<ReportEntity>): ReportEntity {
		return new ReportEntity({ ...this.props, ...reportEntity });
	}

	toObject(): ReportProps {
		return { ...this.props };
	}
}
