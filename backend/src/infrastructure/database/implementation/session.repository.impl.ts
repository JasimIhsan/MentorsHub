import { session } from "passport";
import { ISessionRepository } from "../../../domain/dbrepository/session.repository";
import { SessionModel } from "../models/session/session.model";
import { SessionEntity } from "../../../domain/entities/session.entity";
import { handleError } from "./user.repository.impl";
import { ISessionDTO } from "../../../application/dtos/session.dto";

export class SessionRepositoryImpl implements ISessionRepository {
	async createSession(session: SessionEntity): Promise<SessionEntity> {
		try {
			const newSession = new SessionModel(session);
			const savedSession = await newSession.save();
			return SessionEntity.fromDBDocument(savedSession);
		} catch (error) {
			return handleError(error, "Error creating session");
		}
	}

	async fetchSessionsByUser(userId: string): Promise<ISessionDTO[]> {
		try {
			const sessions = await SessionModel.find({ userId }).populate("mentorId", "firstName lastName avatar");
			const sessionDTOs: ISessionDTO[] = sessions.map((session) => ({
				id: session._id.toString(),
				mentor: {
					_id: session.mentorId._id.toString(),
					firstName: (session.mentorId as any).firstName,
					lastName: (session.mentorId as any).lastName,
					avatar: (session.mentorId as any).avatar,
				},
				userId: session.userId.toString(),
				topic: session.topic,
				sessionType: session.sessionType,
				sessionFormat: session.sessionFormat,
				date: session.date.toISOString(),
				time: session.time,
				hours: session.hours,
				message: session.message,
				status: session.status,
				paymentStatus: session.paymentStatus,
				pricing: session.pricing,
				paymentId: session.paymentId,
				totalAmount: session.totalAmount,
				createdAt: session.createdAt.toISOString(),
			}));
			return sessionDTOs;
		} catch (error) {
			return handleError(error, "Error fetching sessions by user");
		}
	}

	async fetchSessionRequestByMentor(mentorId: string): Promise<any[]> {
		try {
			const sessions = await SessionModel.find({ mentorId }).populate("userId", "firstName lastName avatar");
			const sessionDTOs = sessions.map((session) => ({
				id: session._id.toString(),
				mentor: session.mentorId.toString(),
				userId: {
					_id: session.userId._id.toString(),
					firstName: (session.userId as any).firstName,
					lastName: (session.userId as any).lastName,
					avatar: (session.userId as any).avatar,
				},
				topic: session.topic,
				sessionType: session.sessionType,
				sessionFormat: session.sessionFormat,
				date: session.date.toISOString(),
				time: session.time,
				hours: session.hours,
				message: session.message,
				status: session.status,
				paymentStatus: session.paymentStatus,
				pricing: session.pricing,
				paymentId: session.paymentId,
				totalAmount: session.totalAmount,
				createdAt: session.createdAt.toISOString(),
			}));
			return sessionDTOs;
		} catch (error) {
			return handleError(error, "Error fetching session requests by mentor");
		}
	}
}
