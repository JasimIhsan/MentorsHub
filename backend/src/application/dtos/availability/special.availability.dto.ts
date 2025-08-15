import { SpecialAvailabilityEntity } from "../../../domain/entities/availability/special.availability.entity";

export interface ISpecialAvailabilityDTO {
	id: string;
	mentorId: string;
	date: Date;
	startTime: string;
	endTime: string;
	createdAt: Date;
	updatedAt: Date;
}

export function mapToISpecialAvailabilityDTO(availability: SpecialAvailabilityEntity): ISpecialAvailabilityDTO {
	return {
		id: availability.id,
		mentorId: availability.mentorId,
		date: availability.date,
		startTime: availability.startTime,
		endTime: availability.endTime,
		createdAt: availability.createdAt,
		updatedAt: availability.updatedAt,
	};
}
