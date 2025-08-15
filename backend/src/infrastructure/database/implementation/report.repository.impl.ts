import mongoose from "mongoose";
import { ReportEntity } from "../../../domain/entities/report.entity";
import { IReportRepository } from "../../../domain/repositories/report.repository";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { ReportModel } from "../models/report/report.model";
import { ReportStatusEnum } from "../../../application/interfaces/enums/report.status.enum";

export class ReportRepositoryImpl implements IReportRepository {
	async create(report: ReportEntity): Promise<ReportEntity> {
		try {
			const newReport = new ReportModel(report.toObject());
			await newReport.save();
			return ReportEntity.fromDbDocument(newReport);
		} catch (error) {
			return handleExceptionError(error, "Error creating report");
		}
	}

	async findById(id: string): Promise<ReportEntity | null> {
		try {
			const doc = await ReportModel.findById(id);
			return doc ? ReportEntity.fromDbDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding report by ID");
		}
	}

	async deleteById(id: string): Promise<void> {
		try {
			const deleted = await ReportModel.findByIdAndDelete(id);
			if (!deleted) throw new Error("Report not found");
		} catch (error) {
			return handleExceptionError(error, "Error deleting report");
		}
	}

	async update(report: ReportEntity): Promise<ReportEntity> {
		try {
			const updated = await ReportModel.findByIdAndUpdate(report.id, report.toObject(), { new: true });
			if (!updated) throw new Error("Report not found");
			return ReportEntity.fromDbDocument(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating report");
		}
	}

	async updateStatus(reportId: string, status: string): Promise<ReportEntity> {
		try {
			const updated = await ReportModel.findByIdAndUpdate(reportId, { status }, { new: true }).lean();
			if (!updated) throw new Error("Report not found");
			return ReportEntity.fromDbDocument(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating report status");
		}
	}

	async findAll(page: number, limit: number, searchTerm?: string, status?: string): Promise<{ tasks: ReportEntity[]; totalCount: number }> {
		try {
			const skip = (page - 1) * limit;

			const query: any = {};

			if (searchTerm) query.reportedId = new mongoose.Types.ObjectId(searchTerm);
			if (status) query.status = status;
			const totalCount = await ReportModel.countDocuments(query);

			const docs = await ReportModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

			return { tasks: docs.map((doc) => ReportEntity.fromDbDocument(doc)), totalCount };
		} catch (error) {
			return handleExceptionError(error, "Error finding all reports");
		}
	}

	async updateReportsByReportedId(reportedId: string, status: string): Promise<number> {
		try {
			const result = await ReportModel.updateMany({ reportedId, status: ReportStatusEnum.PENDING }, { $set: { status } });

			return result.modifiedCount;
		} catch (error) {
			return handleExceptionError(error, "Error updating many reports by reported ID");
		}
	}
}
