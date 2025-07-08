import { SessionEntity } from "../../domain/entities/session.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { WalletTransactionEntity } from "../../domain/entities/wallet/wallet.transaction.entity";
import { RoleEnum } from "../interfaces/enums/role.enum";
import { TransactionPurposeEnum } from "../interfaces/enums/transaction.purpose.enum";
import { TransactionsTypeEnum } from "../interfaces/enums/transaction.type.enum";

export interface IWalletTransactionDTO {
	_id: string;
	fromUserId: {
		id: string;
		name: string;
		avatar: string;
	} | null;
	toUserId: {
		id: string;
		name: string;
		avatar: string;
	} | null;
	fromRole: RoleEnum;
	toRole: RoleEnum;
	amount: number;
	type: TransactionsTypeEnum;
	purpose: TransactionPurposeEnum;
	description?: string;
	sessionId?: {
		id: string;
		topic: string;
	} | null;
	createdAt: Date;
}

export function mapToTransactionDTO(transaction: WalletTransactionEntity, fromUser: UserEntity | null, toUser: UserEntity | null, session: SessionEntity | null): IWalletTransactionDTO {
	return {
		_id: transaction.id!,
		fromUserId: fromUser ? { id: fromUser.id!, name: fromUser.firstName, avatar: fromUser.avatar || "" } : null,
		toUserId: toUser ? { id: toUser.id!, name: toUser.firstName, avatar: toUser.avatar || "" } : null,
		fromRole: transaction.fromRoleEnum as RoleEnum,
		toRole: transaction.toRoleEnum as RoleEnum,
		amount: transaction.transactionAmount,
		type: transaction.transactionType,
		purpose: transaction.transactionPurpose,
		description: transaction.transactionDescription,
		sessionId: session ? { id: session.id, topic: session.topic } : null,
		createdAt: transaction.created!,
	};
}
