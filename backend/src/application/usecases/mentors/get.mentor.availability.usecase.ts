import dayjs from "dayjs";
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IGetAvailabilityUseCase } from "../../interfaces/mentors/mentors.interface";
import { WeekDay } from "../../../domain/entities/mentor.detailes.entity";

import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export class GetAvailabilityUseCase implements IGetAvailabilityUseCase {
	constructor(private mentorRepo: IMentorProfileRepository, private sessionRepo: ISessionRepository) {}

	async execute(userId: string, date: Date): Promise<string[]> {
		const dayName = dayjs(date).format("dddd") as WeekDay;

		const allSlots = await this.mentorRepo.getAvailability(userId);
		if (!allSlots) return [];

		const slotsInDate = allSlots.availability[dayName];

		const sessions = await this.sessionRepo.findByDate(userId, date);

		const bookedSessions = sessions?.filter((s) => s.status !== "approved" && s.status !== "upcoming");

		const bookedTimeSet = new Set<string>();

		if (bookedSessions) {
			bookedSessions?.forEach((s) => {
				const sessionStartTime = s.time;
				const sessionHours = s.hours;

				for (let i = 0; i < sessionHours; i++) {
					const slotTime = dayjs(sessionStartTime, "HH:mm").add(i, "hour").format("HH:mm");
					bookedTimeSet.add(slotTime);
				}
			});
		}

		return bookedSessions ? slotsInDate.filter((slot) => !bookedTimeSet.has(slot)) : slotsInDate;
	}
}
