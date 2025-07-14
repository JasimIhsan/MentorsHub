// infrastructure/database/repositories/session.repository.impl.ts

import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { SessionModel } from "../models/session/session.model";
import { SessionEntity } from "../../../domain/entities/session.entity";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { SessionStatusEnum } from "../../../application/interfaces/enums/session.status.enums";
import { SessionPaymentStatusEnum } from "../../../application/interfaces/enums/session.payment.status.enum";
import mongoose from "mongoose";

export class SessionRepositoryImpl implements ISessionRepository {
	async create(session: SessionEntity): Promise<SessionEntity> {
		try {
			const obj = session.toObject();
			const newSession = new SessionModel({
				mentorId: obj.mentor.id,
				participants: obj.participants.map((p) => ({
					userId: p.user.id,
					paymentStatus: p.paymentStatus,
					paymentId: p.paymentId,
				})),
				topic: obj.topic,
				sessionFormat: obj.sessionFormat,
				date: obj.date,
				time: obj.time,
				hours: obj.hours,
				message: obj.message,
				status: obj.status,
				pricing: obj.pricing,
				totalAmount: obj.totalAmount,
				rejectReason: obj.rejectReason,
			});
			const saved = await newSession.save();
			return SessionEntity.fromDB(saved);
		} catch (error) {
			return handleExceptionError(error, "Error creating session");
		}
	}

	async findById(id: string): Promise<SessionEntity | null> {
		try {
			const session = await SessionModel.findById(id).populate("mentorId", "firstName lastName avatar").populate("participants.userId", "firstName lastName avatar");
			return session ? SessionEntity.fromDB(session) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding session by ID");
		}
	}

	async findByIds(ids: string[]): Promise<SessionEntity[]> {
		try {
			const sessions = await SessionModel.find({ _id: { $in: ids } })
				.populate("mentorId", "firstName lastName avatar")
				.populate("participants.userId", "firstName lastName avatar");
			return sessions.map(SessionEntity.fromDB);
		} catch (error) {
			return handleExceptionError(error, "Error finding sessions by IDs");
		}
	}

	async findByUser(
		userId: string,
		options?: {
			page?: number;
			limit?: number;
			search?: string;
			status?: string;
		},
	): Promise<{ sessions: SessionEntity[]; total: number }> {
		try {
			const { page = 1, limit = 10, search = "", status = "" } = options || {};
			const skip = (page - 1) * limit;

			const filter: any = {
				"participants.userId": userId,
			};

			// Optional: Filter by session status
			if (status && status !== "all") {
				filter.status = status;
			}

			// Optional: Search by mentor name (populate won't work directly in match, so do text-based if needed)
			if (search) {
				filter.$or = [
					{ title: { $regex: search, $options: "i" } }, // If sessions have a title
					// You can also implement `$lookup` + `$match` in aggregation if you want to search mentor name
				];
			}

			const sessions = await SessionModel.find(filter).populate("mentorId", "firstName lastName avatar").populate("participants.userId", "firstName lastName avatar").sort({ updatedAt: -1 }).skip(skip).limit(limit);
			const total = await SessionModel.countDocuments(filter);
			return { sessions: sessions.map(SessionEntity.fromDB), total };
		} catch (error) {
			return handleExceptionError(error, "Error getting sessions by user");
		}
	}

	async findByMentor(
		mentorId: string,
		{
			status,
			filter,
			page,
			limit,
		}: {
			status?: SessionStatusEnum;
			filter?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		},
	): Promise<{ sessions: SessionEntity[]; total: number }> {
		try {
			const query: any = { mentorId };
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			switch (filter) {
				case "free":
					query.pricing = "free";
					break;
				case "paid":
					query.pricing = "paid";
					break;
				case "today":
					query.date = {
						$gte: today,
						$lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
					};
					break;
				case "week":
					const startOfWeek = new Date(today);
					startOfWeek.setDate(today.getDate() - today.getDay());
					const endOfWeek = new Date(startOfWeek);
					endOfWeek.setDate(startOfWeek.getDate() + 7);
					query.date = { $gte: startOfWeek, $lt: endOfWeek };
					break;
				case "month":
					const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
					const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
					query.date = { $gte: startOfMonth, $lt: endOfMonth };
					break;
			}

			if (status) query.status = status;

			const total = await SessionModel.countDocuments(query);
			const docs = await SessionModel.find(query)
				.skip((page - 1) * limit)
				.limit(limit)
				.populate("mentorId", "firstName lastName avatar")
				.populate("participants.userId", "firstName lastName avatar");

			return {
				total,
				sessions: docs.map(SessionEntity.fromDB),
			};
		} catch (error) {
			return handleExceptionError(error, "Error finding sessions by mentor");
		}
	}

	async findSessionCount(mentorId: string, status: SessionStatusEnum): Promise<number> {
		try {
			const total = await SessionModel.countDocuments({ mentorId, status });
			return total;
		} catch (error) {
			return handleExceptionError(error, "Error finding sessions by mentor");
		}
	}

	async updateStatus(sessionId: string, status: SessionStatusEnum, reason?: string): Promise<SessionEntity> {
		try {
			const updated = await SessionModel.findByIdAndUpdate(sessionId, { status, rejectReason: reason }, { new: true }).populate("mentorId", "firstName lastName avatar").populate("participants.userId", "firstName lastName avatar");

			if (!updated) throw new Error("Session not found");
			return SessionEntity.fromDB(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating session status");
		}
	}

	async markPayment(sessionId: string, userId: string, paymentStatus: SessionPaymentStatusEnum, paymentId: string, newStatus: SessionStatusEnum): Promise<void> {
		try {
			await SessionModel.findOneAndUpdate(
				{ _id: sessionId, "participants.userId": userId },
				{
					$set: {
						"participants.$.paymentStatus": paymentStatus,
						"participants.$.paymentId": paymentId,
						status: newStatus,
					},
				},
			);
		} catch (error) {
			return handleExceptionError(error, "Error updating session payment");
		}
	}

	async getAllByMentor(mentorId: string): Promise<SessionEntity[]> {
		try {
			const sessions = await SessionModel.find({ mentorId }).populate("mentorId", "firstName lastName avatar").populate("participants.userId", "firstName lastName avatar");
			return sessions.map(SessionEntity.fromDB);
		} catch (error) {
			return handleExceptionError(error, "Error fetching all mentor sessions");
		}
	}

	async getExpirableSessions(): Promise<SessionEntity[]> {
		const now = new Date();

		const sessions = await SessionModel.find({
			status: { $in: [SessionStatusEnum.APPROVED, SessionStatusEnum.PENDING, SessionStatusEnum.UPCOMING] },
		}).lean();

		const expirable = sessions.filter((session) => {
			const [hours, minutes] = session.time.split(":").map(Number);
			const sessionStart = new Date(session.date);
			sessionStart.setHours(hours);
			sessionStart.setMinutes(minutes);
			sessionStart.setSeconds(0);

			const sessionEnd = new Date(sessionStart.getTime() + session.hours * 60 * 60 * 1000);
			return sessionEnd < now;
		});

		return expirable.map((doc) => SessionEntity.fromDB(doc));
	}

	async deleteById(sessionId: string): Promise<void> {
		try {
			await SessionModel.findByIdAndDelete(sessionId);
		} catch (error) {
			return handleExceptionError(error, "Error deleting session");
		}
	}

	async findByDate(mentorId: string, date: Date): Promise<SessionEntity[]> {
		try {
			const startOfDay = new Date(date);
			startOfDay.setHours(0, 0, 0, 0);
			const endOfDay = new Date(date);
			endOfDay.setHours(23, 59, 59, 999);

			const sessions = await SessionModel.find({
				mentorId,
				date: { $gte: startOfDay, $lte: endOfDay },
			})
				.populate("mentorId", "firstName lastName avatar")
				.populate("participants.userId", "firstName lastName avatar");

			return sessions.map(SessionEntity.fromDB);
		} catch (error) {
			return handleExceptionError(error, "Error getting sessions by date");
		}
	}

	async getWeeklyPerformance(mentorId: string, period: "month" | "sixMonths" | "year"): Promise<{ week: string; sessions: number; revenue: number }[]> {
		try {
			const startDate = new Date();
			if (period === "month") startDate.setDate(startDate.getDate() - 30);
			else if (period === "sixMonths") startDate.setMonth(startDate.getMonth() - 6);
			else startDate.setFullYear(startDate.getFullYear() - 1);

			const result = await SessionModel.aggregate([
				{
					$match: {
						mentorId: new mongoose.Types.ObjectId(mentorId),
						status: SessionStatusEnum.COMPLETED,
						date: { $gte: startDate },
					},
				},
				{
					$group: {
						_id: {
							week: { $isoWeek: "$date" },
							year: { $isoWeekYear: "$date" },
						},
						sessions: { $sum: 1 },
						revenue: { $sum: "$totalAmount" },
					},
				},
				{
					$sort: { "_id.year": 1, "_id.week": 1 },
				},
				{
					$project: {
						week: { $concat: ["Week ", { $toString: "$_id.week" }, " ", { $toString: "$_id.year" }] },
						sessions: 1,
						revenue: 1,
					},
				},
			]);

			return result.map((r) => ({ week: r.week, sessions: r.sessions, revenue: r.revenue }));
		} catch (error) {
			return handleExceptionError(error, "Error fetching weekly performance");
		}
	}
	async findRevenueByMentor(mentorId: string): Promise<number> {
		try {
			const result = await SessionModel.aggregate([
				{
					$match: {
						mentorId: new mongoose.Types.ObjectId(mentorId),
						pricing: "paid",
						status: "completed",
					},
				},
				{
					$project: {
						participants: 1,
						paidParticipants: {
							$filter: {
								input: "$participants",
								as: "participant",
								cond: { $eq: ["$$participant.paymentStatus", "completed"] },
							},
						},
						totalAmount: 1,
					},
				},
				{
					$project: {
						revenue: {
							$cond: [
								{ $gt: ["$totalAmount", 0] },
								{
									$multiply: [{ $size: "$paidParticipants" }, { $divide: ["$totalAmount", { $size: "$participants" }] }],
								},
								0,
							],
						},
					},
				},
				{
					$group: {
						_id: null,
						totalRevenue: { $sum: "$revenue" },
					},
				},
			]);

			return result[0]?.totalRevenue || 0;
		} catch (error) {
			return handleExceptionError(error, "Error fetching revenue by mentor");
		}
	}

	async countSessions(): Promise<number> {
		try {
			return await SessionModel.countDocuments({ status: SessionStatusEnum.COMPLETED });
		} catch (error) {
			return handleExceptionError(error, "Error counting sessions");
		}
	}
}
