import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { ISessionDocument, SessionModel } from "../models/session/session.model";
import { SessionEntity } from "../../../domain/entities/session.entity";
import { handleError } from "./user.repository.impl";
import { ISessionUserDTO, ISessionMentorDTO } from "../../../application/dtos/session.dto";
import mongoose from "mongoose";

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

	async getSessionRequestByMentor(mentorId: string): Promise<ISessionMentorDTO[]> {
		try {
			const sessions = await SessionModel.find({ mentorId }).populate("participants.userId", "firstName lastName avatar");

			return sessions.map(this.mapSessionToMentorDTO);
		} catch (error) {
			return handleError(error, "Error geting session requests by mentor");
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
			const session = await SessionModel.find({ mentorId, date });
			return session ? session.map((s) => SessionEntity.fromDBDocument(s)) : null;
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
