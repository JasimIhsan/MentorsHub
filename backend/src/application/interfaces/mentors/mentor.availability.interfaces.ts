import { ISpecialAvailabilityDTO } from "../../dtos/availability/special.availability.dto";
import { IWeeklyAvailabilityDTO } from "../../dtos/availability/weekly.availability.dto";

export interface IAddSlotAvailabilityToWeekUseCase {
	execute(mentorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<IWeeklyAvailabilityDTO>;
}

export interface IGetAllWeeklyAvailabilityUseCase {
	execute(mentorId: string): Promise<IWeeklyAvailabilityDTO[]>;
}

export interface IDeleteWeeklySlotUsecase {
	execute(id: string, mentorId: string): Promise<void>;
}

export interface IUpdateWeeklySlotUseCase {
	execute(id: string, mentorId: string, startTime: string, endTime: string): Promise<void>;
}

export interface IToggleAvailabilityWeeklySlotUseCase {
	execute(id: string, mentorId: string): Promise<void>;
}

export interface IToggleAvailabilityByWeekDayUseCase {
	execute(mentorId: string, dayOfWeek: number, status: boolean): Promise<void>;
}

export interface IAddSpecialSlotUseCase {
	execute(mentorId: string, date: Date, startTime: string, endTime: string): Promise<ISpecialAvailabilityDTO>;
}

export interface IGetSpecialSlotByMentorUseCase {
	execute(mentorId: string): Promise<ISpecialAvailabilityDTO[]>;
}

export interface IDeleteSpecialSlotUseCase {
	execute(slotId: string, mentorId: string): Promise<void>;
}

export interface IUpdateSpecialSlotUseCase {
	execute(id: string, mentorId: string, startTime: string, endTime: string): Promise<void>;
}
