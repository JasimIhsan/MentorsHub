export enum WithdrawalStatusEnum {
	PENDING = "pending",
	REJECTED = "rejected",
	COMPLETED = "completed",
}

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
	status: WithdrawalStatusEnum;
	transactionId?: string;
	processedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}
