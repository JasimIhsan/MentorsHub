import { IWeeklyAvailabilityDTO } from "../../dtos/availability.dto";

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