// infrastructure/database/repositories/session.repository.impl.ts

import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { SessionModel } from "../models/session/session.model";
import { SessionEntity, SessionStatus, SessionPaymentStatus } from "../../../domain/entities/session.entity";
import { handleExceptionError } from "../../utils/handle.exception.error";

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
				sessionType: obj.sessionType,
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

	async findByUser(userId: string): Promise<SessionEntity[]> {
		try {
			const sessions = await SessionModel.find({ "participants.userId": userId }).populate("mentorId", "firstName lastName avatar").populate("participants.userId", "firstName lastName avatar");
			return sessions.map(SessionEntity.fromDB);
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
			status?: SessionStatus;
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

	async updateStatus(sessionId: string, status: SessionStatus, reason?: string): Promise<SessionEntity> {
		try {
			const updated = await SessionModel.findByIdAndUpdate(sessionId, { status, rejectReason: reason }, { new: true }).populate("mentorId", "firstName lastName avatar").populate("participants.userId", "firstName lastName avatar");

			if (!updated) throw new Error("Session not found");
			return SessionEntity.fromDB(updated);
		} catch (error) {
			return handleExceptionError(error, "Error updating session status");
		}
	}

	async markPayment(sessionId: string, userId: string, paymentStatus: SessionPaymentStatus, paymentId: string, newStatus: SessionStatus): Promise<void> {
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
		try {
			const sessions = await SessionModel.find({
				status: { $in: ["pending", "approved", "upcoming"] },
			})
				.populate("mentorId", "firstName lastName avatar")
				.populate("participants.userId", "firstName lastName avatar");

			return sessions.map(SessionEntity.fromDB);
		} catch (error) {
			return handleExceptionError(error, "Error getting sessions to expire");
		}
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
}
