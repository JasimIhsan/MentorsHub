import { SpecialAvailabilityEntity } from "../../entities/availability/special.availability.entity";

export interface ISpecialAvailabilityRepository {
	create(entity: SpecialAvailabilityEntity): Promise<SpecialAvailabilityEntity>;
	delete(id: string): Promise<void>;
	update(entity: SpecialAvailabilityEntity): Promise<void>;
	findById(id: string): Promise<SpecialAvailabilityEntity | null>;
	findByMentorId(mentorId: string): Promise<SpecialAvailabilityEntity[]>;
	isExists(mentorId: string, date: Date, startTime: string, endTime: string): Promise<boolean>;
	findAvailableSlot(mentorId: string, date: Date, durationInHours: number): Promise<string[] | null>;
}
