import { WeeklyAvailabilityEntity } from "../../../domain/entities/availability/weekly.availability.entity";
import { Availability } from "../../../domain/entities/mentor.detailes.entity";

export interface IAvailabilityDTO {
	userId: string;
	availability: Availability;
}

export interface IWeeklyAvailabilityDTO {
	id: string;
	mentorId: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export function mapToWeeklyAvailabilityDTO(availability: WeeklyAvailabilityEntity): IWeeklyAvailabilityDTO {
	return {
		id: availability.id,
		mentorId: availability.mentorId,
		dayOfWeek: availability.dayOfWeek,
		startTime: availability.startTime,
		endTime: availability.endTime,
		isActive: availability.isActive,
		createdAt: availability.createdAt,
		updatedAt: availability.updatedAt,
	};
}
