import { WeeklyAvailabilityEntity } from "../entities/availability/weekly.availability.entity";

export interface IWeeklyAvailabilityRepository {
	create(entity: WeeklyAvailabilityEntity): Promise<void>;
	delete(id: string): Promise<void>;
	update(entity: WeeklyAvailabilityEntity): Promise<void>;
	findById(id: string): Promise<WeeklyAvailabilityEntity | null>;
	isExists(mentorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<boolean>;
	findAllByMentorId(mentorId: string): Promise<WeeklyAvailabilityEntity[]>;
	toggleAvailabilityByWeekDay(mentorId: string, dayOfWeek: number, status: boolean): Promise<void>;
}
