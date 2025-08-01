import { WeeklyAvailabilityEntity } from "../entities/availability/weekly.availability.entity";

export interface IWeeklyAvailabilityRepository {
	create(entity: WeeklyAvailabilityEntity): Promise<void>;
	delete(id: string): Promise<void>;
	update(entity: WeeklyAvailabilityEntity): Promise<void>;
}
