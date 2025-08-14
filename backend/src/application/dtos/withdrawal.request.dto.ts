import { PersonEntity } from "../../domain/entities/session.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { WithdrawalRequestEntity } from "../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { WithdrawalRequestStatusEnum } from "../interfaces/enums/withdrawel.request.status.enum";

export interface IWithdrawalRequestDTO {
	id?: string;
	user: PersonEntity | string;
	amount: number;
	status: WithdrawalRequestStatusEnum;
	transactionId?: string;
	processedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

export function mapToWithdrawalRequestDTO(entity: WithdrawalRequestEntity, user?: UserEntity): IWithdrawalRequestDTO {
	const mapToPerson = (user: UserEntity): PersonEntity => ({
		id: user.id?.toString()!,
		firstName: user.firstName,
		lastName: user.lastName,
		avatar: user.avatar || undefined,
	});

	return {
		id: entity.id,
		user: user ? mapToPerson(user) : entity.userId,
		amount: entity.amount,
		status: entity.status,
		transactionId: entity.transactionId,
		processedAt: entity.processedDate,
		createdAt: entity.createdAt,
		updatedAt: entity.updatedAt,
	};
}
