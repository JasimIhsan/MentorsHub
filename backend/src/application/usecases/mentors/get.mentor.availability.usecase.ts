import dayjs from "dayjs";
import { IMentorProfileRepository } from "../../../domain/repositories/mentor.details.repository";
import { ISessionRepository } from "../../../domain/repositories/session.repository";
import { IGetAvailabilityUseCase } from "../../interfaces/mentors/mentors.interface";
import { WeekDay } from "../../../domain/entities/mentor.detailes.entity";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { SessionStatusEnum } from "../../interfaces/enums/session.status.enums";

dayjs.extend(customParseFormat);

export class GetAvailabilityUseCase implements IGetAvailabilityUseCase {
	constructor(private mentorRepo: IMentorProfileRepository, private sessionRepo: ISessionRepository) {}

	async execute(userId: string, date: Date): Promise<string[]> {
		// Step 1: Get the weekday name (e.g., "Monday")
		const dayName = dayjs(date).format("dddd") as WeekDay;

		// Step 2: Fetch mentor's weekly availability
		const allSlots = await this.mentorRepo.getAvailability(userId);
		if (!allSlots) return [];

		// Step 3: Get available slots for the requested day
		const slotsInDate = allSlots.availability[dayName];
		if (!slotsInDate) return [];

		// Step 4: Get sessions on that day
		const sessions = await this.sessionRepo.findByDate(userId, date);

		// Step 5: Filter only sessions that are really booked
		const bookedSessions = sessions?.filter((s) => s.status === SessionStatusEnum.APPROVED || s.status === SessionStatusEnum.UPCOMING);

		// Step 6: Create a set of booked time slots
		const bookedTimeSet = new Set<string>();

		bookedSessions?.forEach((s) => {
			const sessionStartTime = s.time;
			const sessionHours = s.hours;

			for (let i = 0; i < sessionHours; i++) {
				const slotTime = dayjs(sessionStartTime, "HH:mm").add(i, "hour").format("HH:mm");
				bookedTimeSet.add(slotTime);
			}
		});

		// Step 7: Filter out booked slots from available slots
		const availableSlots = slotsInDate.filter((slot) => !bookedTimeSet.has(slot));
		console.log('availableSlots: ', availableSlots);

		return availableSlots;
	}
}
