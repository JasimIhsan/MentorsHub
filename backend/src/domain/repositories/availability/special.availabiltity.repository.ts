import { SpecialAvailabilityEntity } from "../../entities/availability/special.availability.entity";

export interface ISpecialAvailabilityRepository {
	create(entity: SpecialAvailabilityEntity): Promise<void>;
	delete(id: string): Promise<void>;
	update(entity: SpecialAvailabilityEntity): Promise<void>;
	findById(id: string): Promise<SpecialAvailabilityEntity | null>;
}
