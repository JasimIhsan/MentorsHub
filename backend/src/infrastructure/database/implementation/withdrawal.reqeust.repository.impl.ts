import { WithdrawalRequestEntity } from "../../../domain/entities/wallet/wallet.withdrawel.request.entity";
import { IWithdrawalRequestRepository } from "../../../domain/repositories/withdrawal.request.repository";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { WithdrawalRequestModel } from "../models/wallet/wallet.withdrawel.request.model";

export class WithdrawalRequestRepositoryImpl implements IWithdrawalRequestRepository {
	async create(entity: WithdrawalRequestEntity): Promise<WithdrawalRequestEntity> {
		try {
			const doc = await WithdrawalRequestModel.create(entity.toObject());
			return WithdrawalRequestEntity.fromDBDocument(doc);
		} catch (error) {
			return handleExceptionError(error, "Error creating withdrawal request");
		}
	}

	async findById(id: string): Promise<WithdrawalRequestEntity | null> {
		try {
			const doc = await WithdrawalRequestModel.findById(id);
			return doc ? WithdrawalRequestEntity.fromDBDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding withdrawal request by ID");
		}
	}

	async findByUserId(userId: string): Promise<WithdrawalRequestEntity | null> {
		try {
			const doc = await WithdrawalRequestModel.findOne({ userId });
			return doc ? WithdrawalRequestEntity.fromDBDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding withdrawal request by userId");
		}
	}

	async update(entity: WithdrawalRequestEntity): Promise<WithdrawalRequestEntity | null> {
		try {
			const doc = await WithdrawalRequestModel.findOneAndUpdate({ _id: entity.id }, entity.toObject(), { new: true });
			return doc ? WithdrawalRequestEntity.fromDBDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error updating withdrawal request");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await WithdrawalRequestModel.findByIdAndDelete(id);
		} catch (error) {
			return handleExceptionError(error, "Error deleting withdrawal request");
		}
	}
}
