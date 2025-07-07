import { WalletEntity } from "../../domain/entities/wallet/wallet.entity";

export interface IWalletDTO {
	id: string;
	userId: string;
	role: string;
	balance: number;
	createdAt: Date;
	updatedAt: Date;
}

export function mapToWalletDTO(entity: WalletEntity): IWalletDTO {
	return {
		id: entity.id!,
		userId: entity.userId,
		role: entity.role,
		balance: entity.balance,
		createdAt: entity.createdAt!,
		updatedAt: entity.updatedAt!,
	};
}
