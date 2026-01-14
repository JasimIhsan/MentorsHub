import { SpecialAvailabilityEntity } from "../../../domain/entities/availability/special.availability.entity";
import { WeeklyAvailabilityEntity } from "../../../domain/entities/availability/weekly.availability.entity";

export interface IWeeklyAvailabilityToUserDTO {
	id: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
}

export interface ISpecialAvailabilityToUserDTO {
	id: string;
	date: Date;
	startTime: string;
	endTime: string;
}

export interface IAvailabilityToUserDTO {
	weekly: IWeeklyAvailabilityToUserDTO[];
	special: ISpecialAvailabilityToUserDTO[];
}

export function mapToWeeklyAvailabilityToUserDTO(availability: WeeklyAvailabilityEntity): IWeeklyAvailabilityToUserDTO {
	return {
		id: availability.id,
		dayOfWeek: availability.dayOfWeek,
		startTime: availability.startTime,
		endTime: availability.endTime,
	};
}

export function mapToSpecialAvailabilityToUserDTO(availability: SpecialAvailabilityEntity): ISpecialAvailabilityToUserDTO {
	return {
		id: availability.id,
		date: availability.date,
		startTime: availability.startTime,
		endTime: availability.endTime,
	};
}
