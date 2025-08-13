import { RefundEntity } from "../../../domain/entities/refund.entity";
import { IRefundRepository } from "../../../domain/repositories/refund.repository";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { RefundModel } from "../models/refund/refund.model";

export class RefundRepositoryImpl implements IRefundRepository {
	async create(entity: RefundEntity): Promise<RefundEntity> {
		try {
			const refundObj = RefundEntity.toObject(entity);
			console.log('refundObj: ', refundObj);
			const refund = await RefundModel.create(refundObj);
			return RefundEntity.fromDBDocument(refund);
		} catch (error) {
			return handleExceptionError(error, "Error creating refund");
		}
	}

	async findById(id: string): Promise<RefundEntity | null> {
		try {
			const refund = await RefundModel.findById(id);
			return refund ? RefundEntity.fromDBDocument(refund) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding refund by ID");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await RefundModel.findByIdAndDelete(id);
		} catch (error) {
			return handleExceptionError(error, "Error deleting refund");
		}
	}

	async update(entity: RefundEntity): Promise<RefundEntity | null> {
		try {
			const refundObj = RefundEntity.toObject(entity);
			const refund = await RefundModel.findByIdAndUpdate(entity.id, refundObj, { new: true });
			return refund ? RefundEntity.fromDBDocument(refund) : null;
		} catch (error) {
			return handleExceptionError(error, "Error updating refund");
		}
	}
}
