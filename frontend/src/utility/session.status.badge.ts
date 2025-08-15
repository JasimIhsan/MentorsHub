import { SessionStatusEnum } from "@/interfaces/enums/session.status.enum";

export function getStatusBadgeVariant(status: SessionStatusEnum) {
	switch (status) {
		case SessionStatusEnum.UPCOMING:
		case SessionStatusEnum.APPROVED:
			return "default";
		case SessionStatusEnum.COMPLETED:
			return "secondary";
		case SessionStatusEnum.CANCELED:
		case SessionStatusEnum.REJECTED:
			return "destructive";
		case SessionStatusEnum.PENDING:
			return "outline";
		case SessionStatusEnum.EXPIRED:
			return "secondary";
		default:
			return "outline";
	}
}
