import { WithdrawalRequestStatusEnum } from "../../../application/interfaces/enums/withdrawel.request.status.enum";
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

   async find(input: { page: number; limit: number; status: string; searchTerm?: string }): Promise<{ requests: WithdrawalRequestEntity[]; totalCount: number }> {
      try {
         const skip = (input.page - 1) * input.limit;

         const query: any = {};
         if (input.status && input.status !== "ALL") query.status = input.status;

         const docs = await WithdrawalRequestModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(input.limit);

         const total = await WithdrawalRequestModel.countDocuments(query);

         return { requests: docs.map((doc) => WithdrawalRequestEntity.fromDBDocument(doc as any)), totalCount: total };
      } catch (error) {
         return handleExceptionError(error, "Error finding withdrawal requests");
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

   async findByUserId(userId: string): Promise<WithdrawalRequestEntity[]> {
      try {
         const doc = await WithdrawalRequestModel.find({ userId });
         return doc ? doc.map(WithdrawalRequestEntity.fromDBDocument) : [];
      } catch (error) {
         return handleExceptionError(error, "Error finding withdrawal request by userId");
      }
   }

   async findPendingByUserId(userId: string): Promise<WithdrawalRequestEntity | null> {
      try {
         const doc = await WithdrawalRequestModel.findOne({ userId, status: WithdrawalRequestStatusEnum.PENDING });
         return doc ? WithdrawalRequestEntity.fromDBDocument(doc) : null;
      } catch (error) {
         return handleExceptionError(error, "Error finding withdrawal request by userId");
      }
   }

   async update(entity: WithdrawalRequestEntity): Promise<WithdrawalRequestEntity | null> {
      try {
         const requestObj = entity.toObject();
         const doc = await WithdrawalRequestModel.findOneAndUpdate({ _id: entity.id }, requestObj, { new: true });
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
