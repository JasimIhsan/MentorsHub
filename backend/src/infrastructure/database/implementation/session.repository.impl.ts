import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionDocument, SessionModel } from "../models/session/session.model";
import { SessionEntity } from "../../../domain/entities/session.entity";
import { ISessionUserDTO, ISessionMentorDTO } from "../../../application/dtos/session.dto";
import { handleExceptionError } from "../../utils/handle.exception.error";
import { CommonStringMessage } from "../../../shared/constants/string.messages";

export class SessionRepositoryImpl implements ISessionRepository {
	async createSession(session: SessionEntity): Promise<SessionEntity> {
		try {
			const newSession = new SessionModel({
				...session,
				participants: session.getParticipants().map((participant) => ({
					userId: participant.userId,
					paymentStatus: participant.paymentStatus,
					paymentId: participant.paymentId,
				})),
			});
			const savedSession = await newSession.save();
			return SessionEntity.fromDBDocument(savedSession);
		} catch (error) {
			return handleExceptionError(error, "Error creating session");
		}
	}

	async getSessionById(sessionId: string): Promise<SessionEntity | null> {
		try {
			const session = await SessionModel.findById(sessionId);
			return session ? SessionEntity.fromDBDocument(session) : null;
		} catch (error) {
			return handleExceptionError(error, "Error getting session by ID");
		}
	}

	async getSessionsByUser(userId: string): Promise<ISessionUserDTO[]> {
		try {
			const sessions = await SessionModel.find({ "participants.userId": userId })
				.populate("participants.userId", "firstName lastName avatar")
				.populate("mentorId", "firstName lastName avatar");

			return sessions.map((session) => this.mapSessionToUserDTO(session, userId));
		} catch (error) {
			return handleExceptionError(error, "Error getting sessions by user");
		}
	}

	async getSessionByMentor(
		mentorId: string,
		queryParams: {
			status?: string;
			filterOption?: "all" | "free" | "paid" | "today" | "week" | "month";
			page: number;
			limit: number;
		}
	): Promise<{ sessions: ISessionMentorDTO[]; total: number }> {
		try {
			const { filterOption, page, limit, status } = queryParams;
			const query: any = { mentorId };
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			switch (filterOption) {
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
			const sessionsData = await SessionModel.find(query)
				.populate("participants.userId", "firstName lastName avatar")
				.skip((page - 1) * limit)
				.limit(limit);

			const sessions = sessionsData.map(this.mapSessionToMentorDTO);
			return { sessions, total };
		} catch (error) {
			return handleExceptionError(error, "Error getting sessions by mentor");
		}
	}

	async updateSessionStatus(sessionId: string, status: string, rejectReason?: string): Promise<SessionEntity> {
		try {
			const updatedSession = await SessionModel.findByIdAndUpdate(
				sessionId,
				{ status, rejectReason },
				{ new: true }
			);
			if (!updatedSession) throw new Error(CommonStringMessage.SESSION_NOT_FOUND);
			return SessionEntity.fromDBDocument(updatedSession);
		} catch (error) {
			return handleExceptionError(error, "Error updating session status");
		}
	}

	async paySession(
		sessionId: string,
		userId: string,
		paymentId: string,
		paymentStatus: string,
		status: string
	): Promise<void> {
		try {
			const updated = await SessionModel.findOneAndUpdate(
				{ _id: sessionId, "participants.userId": userId },
				{
					$set: {
						"participants.$.paymentId": paymentId,
						"participants.$.paymentStatus": paymentStatus,
						status: status,
					},
				},
				{ new: true }
			);
			if (!updated) throw new Error("Session or participant not found");
		} catch (error) {
			return handleExceptionError(error, "Error updating session payment");
		}
	}

	async getSessions(mentorId: string): Promise<ISessionMentorDTO[]> {
		try {
			const sessions = await SessionModel.find({ mentorId }).populate("participants.userId", "firstName lastName avatar");
			return sessions.map(this.mapSessionToMentorDTO);
		} catch (error) {
			return handleExceptionError(error, "Error getting all mentor sessions");
		}
	}

	async getSessionToExpire(): Promise<ISessionDocument[]> {
		try {
			return await SessionModel.find({
				status: { $in: ["pending", "approved", "upcoming"] },
			});
		} catch (error) {
			return handleExceptionError(error, "Error finding sessions to expire");
		}
	}

	async expireSession(sessionId: string): Promise<void> {
		try {
			await SessionModel.findByIdAndDelete(sessionId);
		} catch (error) {
			return handleExceptionError(error, "Error expiring session");
		}
	}

	async getSessionByDate(mentorId: string, date: Date): Promise<SessionEntity[] | null> {
		try {
			const startOfDay = new Date(date);
			startOfDay.setUTCHours(0, 0, 0, 0);
			const endOfDay = new Date(date);
			endOfDay.setUTCHours(23, 59, 59, 999);

			const sessions = await SessionModel.find({
				mentorId,
				date: { $gte: startOfDay, $lte: endOfDay },
			});

			return sessions.length > 0 ? sessions.map(SessionEntity.fromDBDocument) : null;
		} catch (error) {
			return handleExceptionError(error, "Error getting sessions by date");
		}
	}

	private mapSessionToUserDTO(session: any, userId: string): ISessionUserDTO {
		const participant = session.participants.find((p: any) =>
			p.userId._id?.toString?.() === userId || p.userId?.toString() === userId
		);

		return {
			id: session._id.toString(),
			mentor: {
				_id: session.mentorId._id.toString(),
				firstName: session.mentorId.firstName,
				lastName: session.mentorId.lastName,
				avatar: session.mentorId.avatar,
			},
			userId: participant?.userId._id?.toString() || participant?.userId?.toString(),
			topic: session.topic,
			sessionType: session.sessionType,
			sessionFormat: session.sessionFormat,
			date: session.date.toISOString(),
			time: session.time,
			hours: session.hours,
			message: session.message,
			status: session.status,
			paymentStatus: participant?.paymentStatus,
			paymentId: participant?.paymentId,
			rejectReason: session.rejectReason,
			pricing: session.pricing,
			totalAmount: session.totalAmount,
			createdAt: session.createdAt.toISOString(),
		};
	}

	private mapSessionToMentorDTO(session: any): ISessionMentorDTO {
		return {
			id: session._id.toString(),
			mentor: session.mentorId.toString(),
			participants: session.participants.map((p: any) => ({
				_id: p.userId._id.toString(),
				firstName: p.userId.firstName,
				lastName: p.userId.lastName,
				avatar: p.userId.avatar,
				paymentStatus: p.paymentStatus,
				paymentId: p.paymentId,
			})),
			topic: session.topic,
			sessionType: session.sessionType,
			sessionFormat: session.sessionFormat,
			date: session.date.toISOString(),
			time: session.time,
			hours: session.hours,
			message: session.message,
			status: session.status,
			rejectReason: session.rejectReason,
			pricing: session.pricing,
			totalAmount: session.totalAmount,
			createdAt: session.createdAt.toISOString(),
		};
	}
}
