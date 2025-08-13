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
				startTime: obj.startTime,
				endTime: obj.endTime,
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

	async update(session: SessionEntity): Promise<SessionEntity> {
		try {
			const updated = await SessionModel.findByIdAndUpdate(session.id, {
				id: session.id,
				mentorId: session.mentor.id,
				participants: session.participants.map((p) => ({
					userId: p.user.id,
					paymentStatus: p.paymentStatus,
					paymentId: p.paymentId,
				})),
				topic: session.topic,
				sessionFormat: session.sessionFormat,
				date: session.date,
				startTime: session.startTime,
				endTime: session.endTime,
				hours: session.hours,
				message: session.message,
				status: session.status,
				pricing: session.pricing,
				totalAmount: session.totalAmount,
				rejectReason: session.rejectReason,
			});
			if (!updated) throw new Error("Session not found");
			return SessionEntity.fromDB(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating session");
		}
	}

	async updateStatus(sessionId: string, status: SessionStatusEnum, reason?: string): Promise<SessionEntity> {
		console.log("reason: ", reason);
		try {
			const updated = await SessionModel.findByIdAndUpdate(sessionId, { status, rejectReason: reason }, { new: true }).populate("mentorId", "firstName lastName avatar").populate("participants.userId", "firstName lastName avatar");

			if (!updated) throw new Error("Session not found");
			return SessionEntity.fromDB(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating session status");
		}
	}

	async markPayment(sessionId: string, userId: string, paymentStatus: SessionPaymentStatusEnum, paymentId: string, newStatus: SessionStatusEnum): Promise<void> {
		console.log("paymentId: ", paymentId);
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
			const [hours, minutes] = session.endTime.split(":").map(Number);
			const sessionEnd = new Date(session.date);
			sessionEnd.setHours(hours);
			sessionEnd.setMinutes(minutes);
			sessionEnd.setSeconds(0);

			// const sessionEnd = new Date(sessionStart.getTime() + session.hours * 60 * 60 * 1000);
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

	async getDailyPerformance(mentorId: string, period: "all" | "month" | "sixMonths" | "year"): Promise<{ name: string; sessions: number; revenue: number }[]> {
		try {
			/* ---------- 1. Build match filter -------------------------------- */
			const match: any = {
				mentorId: new mongoose.Types.ObjectId(mentorId),
				status: SessionStatusEnum.COMPLETED,
			};

			if (period !== "all") {
				const now = new Date();
				if (period === "month") now.setDate(now.getDate() - 30);
				else if (period === "sixMonths") now.setMonth(now.getMonth() - 6);
				else if (period === "year") now.setFullYear(now.getFullYear() - 1);

				match.date = { $gte: now };
			}
			/* ------------------------------------------------------------------ */

			const result = await SessionModel.aggregate([
				{ $match: match },

				// group by calendar DAY
				{
					$group: {
						_id: {
							year: { $year: "$date" },
							month: { $month: "$date" },
							day: { $dayOfMonth: "$date" },
						},
						sessions: { $sum: 1 },
						revenue: { $sum: "$totalAmount" },
					},
				},

				// readable label + sortable date
				{
					$project: {
						name: {
							$concat: [{ $toString: "$_id.day" }, "-", { $toString: "$_id.month" }, "-", { $toString: "$_id.year" }],
						},
						sessions: 1,
						revenue: 1,
						sortDate: {
							$dateFromParts: {
								year: "$_id.year",
								month: "$_id.month",
								day: "$_id.day",
							},
						},
						_id: 0,
					},
				},

				{ $sort: { sortDate: 1 } },

				{ $project: { name: 1, sessions: 1, revenue: 1 } },
			]);

			return result as { name: string; sessions: number; revenue: number }[];
		} catch (error) {
			return handleExceptionError(error, "Error fetching daily performance");
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
