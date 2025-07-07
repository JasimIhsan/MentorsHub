import { SessionEntity } from "../../domain/entities/session.entity";
import { UserEntity } from "../../domain/entities/user.entity";
import { WalletTransactionEntity, WalletTransactionPurpose, WalletTransactionType } from "../../domain/entities/wallet/wallet.transaction.entity";
import { RoleEnum } from "../interfaces/role";

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
	type: WalletTransactionType;
	purpose: WalletTransactionPurpose;
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
		fromRole: transaction.fromUserRole as RoleEnum,
		toRole: transaction.toUserRole as RoleEnum,
		amount: transaction.transactionAmount,
		type: transaction.transactionType,
		purpose: transaction.transactionPurpose,
		description: transaction.transactionDescription,
		sessionId: session ? { id: session.getId()!, topic: session.getTopic()! } : null,
		createdAt: transaction.created!,
	};
}
