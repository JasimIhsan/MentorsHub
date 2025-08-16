import { WeeklyAvailabilityEntity } from "../../entities/availability/weekly.availability.entity";

export interface IWeeklyAvailabilityRepository {
	create(entity: WeeklyAvailabilityEntity): Promise<WeeklyAvailabilityEntity>;
	delete(id: string): Promise<void>;
	update(entity: WeeklyAvailabilityEntity): Promise<void>;
	findById(id: string): Promise<WeeklyAvailabilityEntity | null>;
	isExists(mentorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<boolean>;
	findAllByMentorId(mentorId: string): Promise<WeeklyAvailabilityEntity[]>;
	toggleAvailabilityByWeekDay(mentorId: string, dayOfWeek: number, status: boolean): Promise<void>;
	findAvailableSlots(mentorId: string, date: Date, durationInHours: number): Promise<string[] | null>;
	findByMentorId(mentorId: string): Promise<WeeklyAvailabilityEntity[]>;
}
