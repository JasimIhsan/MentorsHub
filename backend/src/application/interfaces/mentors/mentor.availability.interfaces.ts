export interface IAddSlotAvailabilityToWeekUseCase {
	execute(mentorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<void>;
}
