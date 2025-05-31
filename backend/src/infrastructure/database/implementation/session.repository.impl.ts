import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionDocument, SessionModel } from "../models/session/session.model";
import { SessionEntity } from "../../../domain/entities/session.entity";
import { handleError } from "./user.repository.impl";
import { ISessionUserDTO, ISessionMentorDTO } from "../../../application/dtos/session.dto";

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
			return handleError(error, "Error creating session");
		}
	}

	async getSessionsByUser(userId: string): Promise<ISessionUserDTO[]> {
		try {
			const sessions = await SessionModel.find({ "participants.userId": userId }).populate("participants.userId", "firstName lastName avatar").populate("mentorId", "firstName lastName avatar");
			return sessions.map((session) => this.mapSessionToUserDTO(session, userId));
		} catch (error) {
			return handleError(error, "Error geting sessions by user");
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
			console.log('queryParams: ', queryParams);

			const query: any = { mentorId };

			// Apply filters based on the single filterOption value
			const today = new Date();
			today.setHours(0, 0, 0, 0); // set to midnight

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
					startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
					const endOfWeek = new Date(startOfWeek);
					endOfWeek.setDate(startOfWeek.getDate() + 7); // next Sunday

					query.date = {
						$gte: startOfWeek,
						$lt: endOfWeek,
					};
					break;
				case "month":
					const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
					const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

					query.date = {
						$gte: startOfMonth,
						$lt: endOfMonth,
					};
					break;
				case "all":
				default:
					break;
			}

			if (status) {
				query.status = status;
			}

			const total = await SessionModel.countDocuments(query);

			const sessionsData = await SessionModel.find(query)
				.populate("participants.userId", "firstName lastName avatar")
				.skip((page - 1) * limit)
				.limit(limit);

			const sessions = sessionsData.map(this.mapSessionToMentorDTO);

			return { sessions, total };
		} catch (error) {
			throw new Error(`Error getting session requests by mentor: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	async updateRequestStatus(sessionId: string, status: string, rejectReason?: string): Promise<void> {
		try {
			const updatedSession = await SessionModel.findByIdAndUpdate(sessionId, { status, rejectReason }, { new: true });
			if (!updatedSession) throw new Error("Session not found");
		} catch (error) {
			return handleError(error, "Error updating session request status");
		}
	}

	async paySession(sessionId: string, userId: string, paymentId: string, paymentStatus: string, status: string): Promise<void> {
		try {
			const updatedSession = await SessionModel.findOneAndUpdate(
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
			if (!updatedSession) throw new Error("Session or participant not found");
		} catch (error) {
			return handleError(error, "Error updating session payment status");
		}
	}

	async getSessions(mentorId: string): Promise<ISessionMentorDTO[]> {
		try {
			const sessions = await SessionModel.find({ mentorId }).populate("participants.userId", "firstName lastName avatar");
			const mappedSessions = sessions.map(this.mapSessionToMentorDTO);
			return mappedSessions;
		} catch (error) {
			return handleError(error, "Error geting sessions");
		}
	}

	async getSessionToExpire(): Promise<ISessionDocument[]> {
		const sessions = await SessionModel.find({
			status: { $in: ["pending", "approved", "upcoming"] },
		});
		return sessions;
	}

	async expireSession(sessionId: string): Promise<void> {
		await SessionModel.findByIdAndDelete(sessionId, { status: "expired" });
	}

	async getSessionByDate(mentorId: string, date: Date): Promise<SessionEntity[] | null> {
		try {
			// Create start and end of the day for the given date
			const startOfDay = new Date(date);
			startOfDay.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
			const endOfDay = new Date(date);
			endOfDay.setUTCHours(23, 59, 59, 999); // Set to end of day UTC

			// Query sessions within the date range
			const sessions = await SessionModel.find({
				mentorId,
				date: {
					$gte: startOfDay,
					$lte: endOfDay,
				},
			});

			return sessions.length > 0 ? sessions.map((s) => SessionEntity.fromDBDocument(s)) : null;
		} catch (error) {
			return handleError(error, "Error getting session by date and status");
		}
	}

	private mapSessionToUserDTO(session: any, userId: string): ISessionUserDTO {
		const participant = session.participants.find((p: any) => p.userId._id?.toString?.() === userId || p.userId?.toString() === userId);
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
			paymentStatus: session.participants?.paymentStatus,
			paymentId: session.participants?.paymentId,
			rejectReason: session.rejectReason,
			pricing: session.pricing,
			totalAmount: session.totalAmount,
			createdAt: session.createdAt.toISOString(),
		};
	}
}
