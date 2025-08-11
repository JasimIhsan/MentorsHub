import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IGetAvailabilityUseCase } from "../../interfaces/mentors/mentors.interface";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";
import { IWeeklyAvailabilityRepository } from "../../../domain/repositories/availability/weekly.availability.repository";
import { ISpecialAvailabilityRepository } from "../../../domain/repositories/availability/special.availabiltity.repository";
import dayjs from "dayjs";

export class GetAvailabilityUseCase implements IGetAvailabilityUseCase {
	constructor(private readonly _sessionRepo: ISessionRepository, private readonly _weekAvailabilityRepo: IWeeklyAvailabilityRepository, private readonly _specialAvailabilityRepo: ISpecialAvailabilityRepository) {}

	async execute(userId: string, date: Date, hours: number): Promise<string[]> {
		console.log("📅 Requested date:", date);

		// 1. Fetch special availability
		const specialSlots = await this._specialAvailabilityRepo.findAvailableSlot(userId, date, hours);
		console.log("🎯 Special slots:", specialSlots);

		// 2. Fetch weekly availability
		const weekSlots = await this._weekAvailabilityRepo.findAvailableSlots(userId, date, hours);
		console.log("🗓️ Weekly slots:", weekSlots);

		// 3. Merge and sort
		const slotsInDate: string[] = [...(specialSlots || []), ...(weekSlots || [])];
		slotsInDate.sort((a, b) => a.localeCompare(b));
		if (slotsInDate.length === 0) return [];

		// 4. Get all sessions for the day
		const sessions = await this._sessionRepo.findByDate(userId, date);

		// 5. Filter active sessions only
		const activeSessions = sessions?.filter((s) => [SessionStatusEnum.APPROVED, SessionStatusEnum.UPCOMING, SessionStatusEnum.ONGOING].includes(s.status));

		// 6. Mark booked slots
		const bookedSlotSet = new Set<string>();
		activeSessions?.forEach((session) => {
			const sessionStart = dayjs(`${dayjs(session.date).format("YYYY-MM-DD")}T${session.startTime}`);

			for (let i = 0; i < session.hours; i++) {
				const slot = sessionStart.add(i, "hour").format("HH:mm");
				bookedSlotSet.add(slot);
			}
		});
		console.log("⛔ Booked slots: ", Array.from(bookedSlotSet));

		// 7. Remove booked slots from available ones
		const availableSlots = slotsInDate.filter((slot) => !bookedSlotSet.has(slot));
		console.log("✅ Final Available Slots:", availableSlots);

		return availableSlots;
	}
}
