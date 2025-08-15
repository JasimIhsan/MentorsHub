import { RefundEntity } from "../entities/refund.entity";

export interface IRefundRepository {
	create(entity: RefundEntity): Promise<RefundEntity>
	update(entity: RefundEntity): Promise<RefundEntity | null>
	findById(id: string): Promise<RefundEntity | null>
	delete(id: string): Promise<void>
}