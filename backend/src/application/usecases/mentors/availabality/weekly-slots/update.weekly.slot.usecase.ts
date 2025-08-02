import { IWeeklyAvailabilityRepository } from "../../../../../domain/repositories/availability/weekly.availability.repository";
import { ISessionRepository } from "../../../../../domain/repositories/session.repository";
import { IUpdateWeeklySlotUseCase } from "../../../../interfaces/mentors/mentor.availability.interfaces";

export class UpdateWeeklySlotUseCase implements IUpdateWeeklySlotUseCase {
	constructor(private readonly _weekRepo: IWeeklyAvailabilityRepository, private readonly _sessionRepo: ISessionRepository) {}

	async execute(id: string, mentorId: string, startTime: string, endTime: string): Promise<void> {
		const slot = await this._weekRepo.findById(id);
		if (!slot) throw new Error("Slot not found");
		if (slot.mentorId !== mentorId) throw new Error("Slot does not belong to the mentor");

		const isExists = await this._weekRepo.isExists(mentorId, slot.dayOfWeek, startTime, endTime);
		if (isExists) throw new Error("Slot already exists or overlaps existing slots");

		// const sessions = await this._sessionRepo.getAllByMentor(mentorId);

		// for (const session of sessions) {
		// 	const sessionTime = session.time;
		// 	const sessionEndTime = this.getEndTime(session.time, session.hours);

		// 	if (
		// 		// session was within old slot but now outside new slot
		// 		this.isWithinTimeRange(sessionTime, sessionEndTime, slot.startTime, slot.endTime) &&
		// 		!this.isWithinTimeRange(sessionTime, sessionEndTime, startTime, endTime)
		// 	) {
		// 		throw new Error("Cannot update slot: existing session falls outside the new time range.");
		// 	}
		// }

		slot.startTime = startTime;
		slot.endTime = endTime;
		await this._weekRepo.update(slot);
	}

	private getEndTime(startTime: string, durationHours: number): string {
		const [hours, minutes] = startTime.split(":").map(Number);
		const endDate = new Date(0, 0, 0, hours + durationHours, minutes);
		return endDate.toTimeString().slice(0, 5); // "HH:mm"
	}

	private isWithinTimeRange(start: string, end: string, rangeStart: string, rangeEnd: string): boolean {
		return start >= rangeStart && end <= rangeEnd;
	}
}
