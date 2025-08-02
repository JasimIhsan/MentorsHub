import { IWeeklyAvailabilityRepository } from "../../../../../domain/repositories/availability/weekly.availability.repository";
import { IDeleteWeeklySlotUsecase } from "../../../../interfaces/mentors/mentor.availability.interfaces";

export class DeleteWeeklySlotUsecase implements IDeleteWeeklySlotUsecase {
	constructor(private readonly _weekRepo: IWeeklyAvailabilityRepository) {}

	async execute(id: string, mentorId: string): Promise<void> {
		const slot = await this._weekRepo.findById(id);
		if (!slot) throw new Error("Slot not found");
		if (slot.mentorId !== mentorId) throw new Error("Slot does not belong to the mentor");

		// Soft Remove for Future
		// You can’t delete a slot if it’s already booked in the future. So follow this logic:

		// 👉 When mentor tries to delete a slot:
		// Check if any sessions are already booked in the future for that slot.
		// If yes, show warning like:
		// “You have booked sessions in this slot. You can’t remove this slot now. You can either reschedule or cancel the session first.”
		// 2. Mark as "inactive for future scheduling"
		// Instead of deleting, you mark the slot as inactive, so:
		// It won’t be available for new bookings.
		// Already booked sessions remain unaffected.

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

		await this._weekRepo.delete(id);
	}
}
