import { UserEntity } from "../../domain/entities/user.entity";
import { WithdrawalRequestEntity } from "../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { WithdrawalRequestStatusEnum } from "../interfaces/enums/withdrawel.request.status.enum";

interface Person {
	_id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface IWithdrawalRequestDTO {
	id: string;
	user?: Person;
	amount: number;
	status: WithdrawalRequestStatusEnum;
	transactionId?: string;
	processedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

function mapToPerson(user: UserEntity): Person {
	return {
		_id: user.id?.toString() ?? "",
		firstName: user.firstName ?? "",
		lastName: user.lastName ?? "",
		avatar: user.avatar || undefined,
	};
}

export function mapToWithdrawalRequestDTO(entity: WithdrawalRequestEntity, user?: UserEntity): IWithdrawalRequestDTO {
	if (!entity) {
		throw new Error("WithdrawalRequestEntity is required");
	}

	return {
		id: entity.id?.toString() ?? "",
		user: user ? mapToPerson(user) : undefined,
		amount: entity.amount,
		status: entity.status,
		transactionId: entity.transactionId ?? undefined,
		processedAt: entity.processedDate ?? undefined,
		createdAt: entity.createdAt ?? undefined,
		updatedAt: entity.updatedAt ?? undefined,
	};
}
